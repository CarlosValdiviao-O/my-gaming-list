const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const rawg = functions.config().rawg.key;
const firestore = admin.firestore();

exports.getRAWG = functions.https.onCall( async (data, context) => {
  let url = data.link + `&key=${rawg}`;
  let resp = await fetchData(url);
  return resp;
});

async function fetchData(url) {
  let response;
  await axios.get(url).then(resp => {
    response = resp.data;
    response.next = null;
    response.previous = null;
  });
  return JSON.stringify(response);
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
      transaction.set(gameRef, {
        name: data.gameName,
        id: data.gameId,
        score: (scoreExist === true) ? data.score : 0,
        avgScore: (scoreExist === true) ? data.score : null,
        members: 1,
        numberOfScores: (scoreExist === true) ? 1 : 0,
        platforms: data.platforms,
        genres: data.genres,
        releaseDate: data.releaseDate,
        familyGames: data.familyGames,
        img: data.gameImg,
        description: data.gameDescription,
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

exports.onUpdateUserGameDoc = functions.firestore.document('userGames/{game}').onUpdate((change, context) => {
  const before = change.before.data();
  const after = change.after.data();
  const gameRef = firestore.collection('games').doc(before.gameId);
  let needsUpdate = (before.score === after.score) ? false : true;

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
