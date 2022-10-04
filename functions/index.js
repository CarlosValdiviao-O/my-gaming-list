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
    const newGames = userDoc.games.concat(data.gameId);
    data.platforms.forEach(plat => {
      if (!newLists.includes(plat)) newLists.push(plat);   
    })
    transaction.update(userRef, {lists: newLists, games: newGames});
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
        img: game.gameImg,
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
  let trailer = await getRAWG(link + '/movies?' + key);
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
    year: (game.releaseDate !== 'TBA') ? new Date(game.releaseDate).getFullYear() : 'TBA',
  }
}

exports.onUpdateUserGameDoc = functions.firestore.document('userGames/{game}').onUpdate((change, context) => {
  const before = change.before.data();
  const after = change.after.data();
  const gameRef = firestore.collection('games').doc(before.gameId);
  let needsUpdate = (before.score === after.score) ? false : true;
  if (before.status !== after.status) needsUpdate = true;

  if (needsUpdate === true) {
    return firestore.runTransaction( async transaction => {
      const game = await transaction.get(gameRef);
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
    newGames.splice(newGames.indexOf(data.gameId), 1);
    transaction.update(userRef, {games: newGames});
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
