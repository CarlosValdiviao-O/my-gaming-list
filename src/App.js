import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from './components/Nav';
import { UserContext } from './components/UserContext';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect, useState } from "react";
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserReviews from './pages/UserReviews';
import UserList from "./pages/UserList";
import 'firebase/compat/functions';
import TopGames from "./pages/TopGames";
import GamesByYear from "./pages/GamesByYear";
import Search from "./pages/Search";
import Reviews from "./pages/Reviews";
import Review from './pages/Review';
import Footer from "./components/Footer";
import Game from "./pages/Game";
import GameCreator from "./pages/GameCreator";

firebase.initializeApp({
  apiKey: "AIzaSyBVpUTLE7RMltSmdPsgD8gh5Gfmdi1xSpc",
  authDomain: "my-gaming-list.firebaseapp.com",
  projectId: "my-gaming-list",
  storageBucket: "my-gaming-list.appspot.com",
  messagingSenderId: "741875249473",
  appId: "1:741875249473:web:c82a32212e83a7231131c0"
});

const auth = firebase.auth();
const firestore = firebase.firestore();


function App() {

  const [ user ] = useAuthState(auth); 
  const [ userData, setUserData ] = useState(null);

  useEffect(checkUser, [user]);

  function signIn () {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    checkUser();
  }

  function checkUser () {
    if (user) {
      const usersRef = firestore.collection('users').doc(user.uid)
      usersRef.get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            usersRef.onSnapshot((doc) => {
              // do stuff with the data
              setUserData(doc.data());
            });
          } else {
            saveUser();
          }
      });
    }  
  }

  function saveUser () {
    firestore.collection('users').doc(user.uid).set({
      name: user.displayName,
      id: user.uid,
      pic: user.photoURL,
      lists: ['All Games'],
      keyword: user.displayName.toLowerCase(),
      games: [],
      stats: {
        allGames: {
          counter: 0,
          playing: 0,
          completed: 0,
          onHold: 0,
          dropped: 0,
          planToPlay: 0,
        }
      }
    });
    checkUser();
  }

  function signOut () {
    auth.signOut();
    setUserData(null);
  }

  return (
    <BrowserRouter basename="/">
      <UserContext.Provider value={userData}>
        <div id='my-gaming-list'>
          <Nav signIn={signIn} signOut={signOut} firebase={firebase} />
          <Routes>
            <Route path="/" element={<Home firebase={firebase}/>} />
            <Route path="/user/:id/:name" element={<Profile firebase={firebase}/>}/>
            <Route path="/review/:id" element={<Review editor={false} firestore={firestore}/>} />
            <Route path="/review/:id/editor/:gameId/:game" element={<Review editor={true} firestore={firestore}/>} />
            <Route path="/reviews" element={<Reviews firestore={firestore}/>}/> 
            <Route path="/reviews/:id/:name" element={<UserReviews/>}/>     
            <Route path="/list/:list/:id/:name" element={<UserList firestore={firestore}/>}/> 
            <Route path="/top-games/:platform" element={<TopGames firestore={firestore}/>}/>  
            <Route path="/top-games/:platform/:type" element={<TopGames firestore={firestore}/>}/>  
            <Route path="/games-by-year/:year" element={<GamesByYear firestore={firestore}/>}/> 
            <Route path="/search" element={<Search firebase={firebase}/>}/>
            <Route path="/search/:platform/:text" element={<Search firebase={firebase}/>}/>
            <Route path="/game/:id/:name" element={<Game firebase={firebase} tab='details'/>} />
            <Route path="/game/:id/:name/reviews" element={<Game firebase={firebase} tab='reviews'/>}/>  
            <Route path="/game_creator" element={<GameCreator firebase={firebase} />} /> 
          </Routes>
        </div>
        <Footer/>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;

//useEffect(() => {
//  if (user) {
//      let data = getLists();
//      Promise.resolve(data).then((val) => setLists(val.lists))
//      setLists(user.lists);
//  }
//}, [user]);
//
//const firestore = getFirestore();
//
//async function getLists() {
//  const docRef = doc(firestore, 'users', user.uid);
//  const docSnap = await getDoc(docRef);
//  const data = docSnap.data();
//  return data;
//}
