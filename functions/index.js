const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const rawg = functions.config().rawg.key;
const firestore = admin.firestore();

exports.getRAWG = functions.https.onCall( async (data, context) => {
  let url = data.link + `&key=${rawg}`;
  let resp = await fetchData(url);
  return JSON.stringify(resp);
});

async function fetchData(url) {
  let response;
  await axios.get(url).then(resp => {
    response = resp.data;
    response.next = null;
    response.previous = null;
  });
  return response;
}

exports.onCreateUserGameDoc = functions.firestore.document('userGames/{game}').onCreate((snapshot, context) => {
  const data = snapshot.data();
  const scoreExist = (data.score !== null) ? true : false;
  const gameRef = firestore.collection('games').doc(data.gameId);
  const userRef = firestore.collection('users').doc(data.userId);

  return firestore.runTransaction( async (transaction) => {
    const user = await transaction.get(userRef);
    const game = await transaction.get(gameRef);
    const userDoc = user.data();
    let newLists = userDoc.lists;
    let newStats = userDoc.stats;
    const newGames = userDoc.games.concat(data.gameId);
    newStats['allGames'][toCamelCase(data.status)] += 1;
    newStats['allGames']['counter'] += 1;
    data.platforms.forEach(plat => {
      if (!newLists.includes(plat)) newLists.push(plat);  
      if (newStats[toCamelCase(plat)] === undefined)      
      newStats[toCamelCase(plat)] = {
        counter: 0,
        playing: 0,
        completed: 0,
        onHold: 0,
        dropped: 0,
        planToPlay: 0,
      }
      newStats[toCamelCase(plat)][toCamelCase(data.status)] += 1;
      newStats[toCamelCase(plat)]['counter'] += 1;
    })
    transaction.update(userRef, {lists: newLists, games: newGames, stats: newStats});
    if (!game.exists) {
      let game = await fetchGameData(data.gameId);
      transaction.set(gameRef, {
        name: game.name,
        id: game.id,
        score: (scoreExist === true) ? data.score : 0,
        avgScore: (scoreExist === true) ? data.score : null,
        members: 1,
        numberOfScores: (scoreExist === true) ? 1 : 0,
        platforms: game.platforms,
        genres: game.genres,
        releaseDate: game.releaseDate,
        year: game.year,
        familyGames: game.familyGames,
        img: game.img,
        description: game.description,
        trailerLink: game.trailerLink,
        screenshots: game.screenshots,
        reviewers: [],
        reviews: 0,
    })}
    else {
      const newMembers = +game.data().members + 1;
      const newScore = (scoreExist === true) ? +game.data().score + +data.score : +game.data().score;
      const newNumberOfScores = (scoreExist === true) ? +game.data().numberOfScores + 1 : +game.data().numberOfScores;
      const newAverage = (newScore > 0 && newNumberOfScores > 0) ? newScore/newNumberOfScores : null;
      transaction.update(gameRef, { members: newMembers, score: newScore, numberOfScores: newNumberOfScores, avgScore: newAverage });
    }   
  });
})

function toCamelCase(str) {
  return str.replace('-', ' ').replace(/(?:^\w|[A-Z]|\b\w|\s+|\/)/g, function(match, index) {
    if (+match === 0) return ""; 
    return index === 0 ? match.toLowerCase() : match.toUpperCase();
  })
}

async function fetchGameData(id) {
  const link = `https://api.rawg.io/api/games/${id}`;
  const key = `&key=${rawg}`;
  let game = await fetchData(link + '?' + key);
  let familyGames = await fetchData(link + '/game-series?' + key);
  let familyGamesArr = [];
  familyGames.results.forEach(item => {
      familyGamesArr.push({
          id: item.id,
          img: item.background_image,
          name: item.name,
      })
  })
  let screenshots = await fetchData(link + '/screenshots?' + key);
  let screenshotsArr = [];
  screenshots.results.forEach(item => {
      screenshotsArr.push(item.image);
  })
  let trailer = await fetchData(link + '/movies?' + key);
  let trailerLink = (trailer.count > 0) ? trailer.results[0].data.max : null;

  let platforms = [];
  let genres = [];
  if (game.platforms !== null) {
    game.platforms.forEach(platform => {
      platforms.push(platform.platform.name)
    })
  }
  if (game.genres !== null) {
    game.genres.forEach(genre => {
      genres.push(genre.name)
    })
  }
  return {
    description: game.description.replace(/<\/p>\n<p>/g, '<br />'),
    genres: genres,
    familyGames: familyGamesArr,
    id: id,
    img: game.background_image,
    name: game.name,
    platforms: platforms,
    releaseDate: (game.tba === false) ? game.released : 'TBA',
    screenshots: screenshotsArr,
    trailerLink: trailerLink,
    year: (game.released !== 'TBA') ? new Date(game.released).getFullYear() : 'TBA',
  }
}

exports.onUpdateUserGameDoc = functions.firestore.document('userGames/{game}').onUpdate((change, context) => {
  const before = change.before.data();
  const after = change.after.data();
  const gameRef = firestore.collection('games').doc(before.gameId);
  const userRef = firestore.collection('users').doc(before.userId);
  let needsUpdate = (before.score === after.score) ? false : true;
  if (before.status !== after.status) needsUpdate = true;

  if (needsUpdate === true) {
    return firestore.runTransaction( async transaction => {
      const game = await transaction.get(gameRef);
      const user = await transaction.get(userRef);
      let newStats = user.data().stats;
      newStats['allGames'][toCamelCase(before.status)] -= 1;
      newStats['allGames'][toCamelCase(after.status)] += 1;
      before.platforms.forEach(plat => {  
        newStats[toCamelCase(plat)][toCamelCase(before.status)] -= 1;
        newStats[toCamelCase(plat)][toCamelCase(after.status)] += 1;
      })
      transaction.update(userRef, {stats: newStats});
      let newScore;
      let newNumberOfScores;
      if (before.score === null) {
        newScore = +game.data().score + +after.score;
        newNumberOfScores = +game.data().numberOfScores + 1;
      }
      if (after.score === null) {
        newScore = +game.data().score - +before.score;
        newNumberOfScores = +game.data().numberOfScores - 1;
      }
      if (before.score !== null && after.score !== null) {
        newScore = +game.data().score - +before.score + +after.score;
        newNumberOfScores = game.data().numberOfScores;
      }
      const newAverage = (newScore > 0 && newNumberOfScores > 0) ? newScore/newNumberOfScores : null;
      transaction.update(gameRef, ({score: newScore, numberOfScores: newNumberOfScores, avgScore: newAverage}));
    })
  }
  else {
    return new Promise;
  }
})

exports.onDeleteUserGameDoc = functions.firestore.document('userGames/{game}').onDelete((snapshot, context) => {
  const data = snapshot.data();
  const gameRef = firestore.collection('games').doc(data.gameId);
  const userRef = firestore.collection('users').doc(data.userId);

  return firestore.runTransaction( async (transaction) => {
    const user = await transaction.get(userRef);
    const game = await transaction.get(gameRef);
    let newGames = user.data().games;
    let newStats = user.data().stats;
    let newLists = user.data().lists;
    newStats['allGames'][toCamelCase(data.status)] -= 1;
    newStats['allGames']['counter'] -= 1;
    data.platforms.forEach(plat => {  
      newStats[toCamelCase(plat)][toCamelCase(data.status)] -= 1;
      newStats[toCamelCase(plat)]['counter'] -= 1;
      if (newStats[toCamelCase(plat)]['counter'] === 0)
      newLists.splice(newLists.indexOf(plat), 1);
    })
    newGames.splice(newGames.indexOf(data.gameId), 1);
    transaction.update(userRef, {games: newGames, stats: newStats, lists: newLists});
    let newScore = game.data().score;
    let newNumberOfScores = +game.data().numberOfScores;
    if (data.score !== null) {
      newScore -= +data.score;
      newNumberOfScores -= 1;
    }
    const newMembers = +game.data().members - 1;
    const newAverage = (newScore > 0 && newNumberOfScores > 0) ? newScore/newNumberOfScores : null;
    transaction.update(gameRef, {members: newMembers, score: newScore, numberOfScores: newNumberOfScores, avgScore: newAverage})
  })
})

exports.updateOnSchedule = functions.pubsub.schedule('5 0 * * *').onRun( async (context) => {
  await updateScore();
  await updatePopularity();
  return new Promise;
})

async function updateScore () {
  let counter = 1;
  let keepGoing = true;
  let firstGroup = true;
  let lastDoc;
  let gamesRef;
  while(keepGoing === true) {
    keepGoing = false;
    if (firstGroup === true) {
      firstGroup = false;
      gamesRef = firestore.collection('games').orderBy('avgScore', 'desc').limit(500);      
    }
    else {
      gamesRef = firestore.collection('games').orderBy('avgScore', 'desc').limit(500).startAfter(lastDoc);
    }
    const games = await gamesRef.get();
    lastDoc = games.docs[games.docs.length-1];
    games.docs.forEach((game) => {
      keepGoing = true;
      if (game.data().rank !== counter || game.data().avgScore !== game.data().visibleScore)
      game.ref.update({
        rank: counter,
        visibleScore: game.data().avgScore,
      })
      counter++;
    })
  }
}

async function updatePopularity () {
  let counter = 1;
  let keepGoing = true;
  let firstGroup = true;
  let lastDoc;
  let gamesRef;
  while(keepGoing === true) {
    keepGoing = false;
    if (firstGroup === true) {
      firstGroup = false;
      gamesRef = firestore.collection('games').orderBy('members', 'desc').limit(500);      
    }
    else {
      gamesRef = firestore.collection('games').orderBy('members', 'desc').limit(500).startAfter(lastDoc);
    }
    const games = await gamesRef.get();
    lastDoc = games.docs[games.docs.length-1];
    games.docs.forEach((game) => {
      keepGoing = true;
      if (game.data().popularity !== counter || game.data().members !== game.data().visibleMembers)
      game.ref.update({
        popularity: counter,
        visibleMembers: game.data().members,
      })
      counter++;
    })
  }
}


exports.onCreateReview = functions.firestore.document('reviews/{id}').onCreate((snapshot, context) => {
  const data = snapshot.data();
  const gameRef = firestore.collection('games').doc(data.gameId);
  const userRef = firestore.collection('users').doc(data.userId);

  return firestore.runTransaction( async (transaction) => {
    const user = await transaction.get(userRef);
    const game = await transaction.get(gameRef);
    const userDoc = user.data();
      
    if (!game.exists) {
      let game = await fetchGameData(data.gameId);
      transaction.set(gameRef, {
        name: game.name,
        id: game.id,
        score: 0,
        avgScore: null,
        members: 0,
        numberOfScores: 0,
        platforms: game.platforms,
        genres: game.genres,
        releaseDate: game.releaseDate,
        year: game.year,
        familyGames: game.familyGames,
        img: game.img,
        description: game.description,
        trailerLink: game.trailerLink,
        screenshots: game.screenshots,
        reviewers: [data.userId],
        reviews: 1,
      })
      transaction.update(snapshot.ref, {gameImg: game.img})
    }
    else {
      if (game.data().reviewers.includes(data.userId))
      transaction.delete(snapshot.ref)
      else {
        let newReviewers = game.data().reviewers;
        newReviewers.push(data.userId); 
        transaction.update(gameRef, { reviews: game.data().reviews + 1, reviewers: newReviewers });
        transaction.update(snapshot.ref, {gameImg: game.data().img})
      }      
    } 
    transaction.update(userRef, {reviews: userDoc.reviews + 1})  
  });
})

exports.onDeleteReview = functions.firestore.document('reviews/{id}').onDelete((snapshot, context) => {
  const data = snapshot.data();
  const gameRef = firestore.collection('games').doc(data.gameId);
  const userRef = firestore.collection('users').doc(data.userId);

  return firestore.runTransaction( async (transaction) => {
    const user = await transaction.get(userRef);
    const game = await transaction.get(gameRef);
    transaction.update(userRef, {reviews: user.data().reviews - 1});
    let newReviewers = game.data().reviewers;
    newReviewers.splice(newReviewers.indexOf(data.userId), 1)
    transaction.update(gameRef, {reviewers: newReviewers, reviews: game.data().reviews - 1})
  })
})

//exports.createGame = functions.https.onCall( async (data, context) => {
//  let game = await fetchGameData(data.id);
//  firestore.collection('games').doc(`${data.id}`).set({
//    name: game.name,
//    id: game.id,
//    score: 0,
//    avgScore: null,
//    members: 0,
//    numberOfScores: 0,
//    platforms: game.platforms,
//    genres: game.genres,
//    releaseDate: game.releaseDate,
//    year: game.year,
//    familyGames: game.familyGames,
//    img: game.img,
//    description: game.description,
//    trailerLink: game.trailerLink,
//    screenshots: game.screenshots,
//    reviewers: [],
//    reviews: 0,
//  })
//  return 'Success';
//});