const functions = require("firebase-functions");
const admin = require('firebase-admin');
const axios = require('axios');

admin.initializeApp();
const rawg = functions.config().rawg.key;

exports.getRAWG = functions.https.onCall( async (data, context) => {
  let url = data.link + `&key=${rawg}`;
  let resp = await fetchData(url);
  return resp;
});

async function fetchData(url) {
  let response;
  await axios.get(url).then(resp => {
    response = resp.data;
  });
  return JSON.stringify(response);
}

