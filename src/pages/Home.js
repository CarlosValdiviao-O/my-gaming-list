import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './../components/UserContext';
import './../components/Home.css'
import GamesCarousel from '../components/GamesCarousel';
import 'firebase/compat/functions';
import 'firebase/compat/firestore';
import ReviewsComponent from '../components/ReviewsComponent';

const Home = (props) => {
    const { firebase, updateUserData } = props;
    const user = useContext(UserContext);
    const [ recentGames, setRecentGames ] = useState(null); 
    const [ recommendedGames, setRecommendedGames ] = useState(null);
    const [ reviews, setReviews ] = useState(null);
    const link = 'https://api.rawg.io/api/games?';
    const getRAWG = firebase.functions().httpsCallable('getRAWG');
    const firestore = firebase.firestore();
    let today = new Date();
    let sixMonthsAgo = new Date(today);
    if (today.getMonth() < 6) {
        sixMonthsAgo.setMonth(today.getMonth() + 6);
        sixMonthsAgo.setFullYear(today.getFullYear() - 1);
    }
    else {
        sixMonthsAgo.setMonth(today.getMonth() - 6);
    }
    const dates = `dates=${sixMonthsAgo.toISOString().substring(0, 10)},${today.toISOString().substring(0, 10)}`;

    const fetchGames = async (link) => {
        let games = await getRAWG({link: link});
        return JSON.parse(games.data);
    }

    useEffect(() => {
        const aux = async () => {
            let recent = await fetchGames(link + dates);
            setRecentGames(recent);
            let recommended = await fetchGames(link + 'metacritic=90,100');
            setRecommendedGames(recommended);
            let reviewsRef = await firestore.collection('reviews').orderBy('createdAt', 'desc').limit(4).get();
            let aux = [];
            reviewsRef.docs.forEach((doc) => {
                aux.push(doc.data());
            })
            setReviews(aux);
        }
        aux();
    }, []);

    return (
        <div id='home'>
            <h1 id='greet'>Welcome to My Gaming List!</h1>
            <div id='columns'>
                <div className='left'>
                    <GamesCarousel games={recentGames} header={'Recent Games'} />
                    <GamesCarousel games={recommendedGames} header={'Recomended Games'} />
                    <ReviewsComponent reviews={reviews} header={'Latest Games Reviews'}
                     firestore={firestore} updateUserData={updateUserData} />
                </div>
                <div className='right'>

                </div>
            </div>
        </div>
    );
};

export default Home;

//left
//  recent games
//  recommended games
//  recent reviews
//  if user last user game updates else ''
//right
//  top recent games
//  most popular games
