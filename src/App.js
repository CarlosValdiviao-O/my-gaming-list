import { BrowserRouter, Route, Routes } from "react-router-dom";
import Nav from './components/Nav';
import { UserContext } from './components/UserContext';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import firebase from 'firebase/compat/app';
import { getFirestore, collection, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useEffect } from "react";
import Home from './pages/Home';
import Profile from './pages/Profile';
import UserReviews from './pages/UserReviews';
import UserList from "./pages/UserList";
import 'firebase/compat/functions';
import TopGames from "./pages/TopGames";
import GamesByYear from "./pages/GamesByYear";
import Search from "./pages/Search";
import Reviews from "./pages/Reviews";
import Footer from "./components/Footer";
import Game from "./pages/Game";

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
    })
  }

  function signOut () {
    auth.signOut();
  }

  return (
    <BrowserRouter basename="/">
      <UserContext.Provider value={user}>
        <Nav signIn={signIn} signOut={signOut} firebase={firebase} />
        <Routes>
          <Route path="/" element={<Home/>} />
          <Route path="/profile/:id" element={<Profile/>}/>
          <Route path="/reviews" element={<Reviews/>}/> 
          <Route path="/reviews/:id" element={<UserReviews/>}/>     
          <Route path="/:list/:id" element={<UserList/>}/> 
          <Route path="/top-games/:platform" element={<TopGames/>}/>  
          <Route path="/games-by-year/:year" element={<GamesByYear/>}/> 
          <Route path="/search/:platform/:text" element={<Search/>}/>
          <Route path="/game/:id" element={<Game/>}/>  
        </Routes>
        <Footer/>
      </UserContext.Provider>
    </BrowserRouter>
  );
}

export default App;
