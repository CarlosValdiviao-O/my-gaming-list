import { useContext, useEffect, useState } from 'react';
import { UserContext } from './../components/UserContext';
import './../components/Home.css'
import GamesCarousel from '../components/GamesCarousel';
import 'firebase/compat/functions';
import 'firebase/compat/firestore';
import ReviewsComponent from '../components/ReviewsComponent';
import LastUserUpdates from '../components/LastUserUpdates';
import SideList from '../components/SideList';

const Home = (props) => {
    const { firebase } = props;
    const user = useContext(UserContext);
    const [ recentGames, setRecentGames ] = useState(null); 
    const [ recommendedGames, setRecommendedGames ] = useState(null);
    const [ reviews, setReviews ] = useState(null);
    const [ userGames, setUserGames ] = useState(null);
    const [ topGames, setTopGames ] = useState(null);
    const [ popularGames, setPopularGames ] = useState(null);
    const link = 'https://api.rawg.io/api/games?';
    const getRAWG = firebase.functions().httpsCallable('getRAWG');
    const firestore = firebase.firestore();
    let today = new Date();
    let threeMonthsAgo = new Date(today);
    if (today.getMonth() < 3) {
        threeMonthsAgo.setMonth(today.getMonth() + 9);
        threeMonthsAgo.setFullYear(today.getFullYear() - 1);
    }
    else {
        threeMonthsAgo.setMonth(today.getMonth() - 3);
    }
    const dates = `dates=${threeMonthsAgo.toISOString().substring(0, 10)},${today.toISOString().substring(0, 10)}`;

    const fetchGames = async (link) => {
        let games = await getRAWG({link: link});
        return JSON.parse(games.data);
    }

    useEffect(() => {
        const aux = async () => {
            let random = Math.floor(Math.random() * 5);
            let recent = await fetchGames(link + dates + `&page=${random + 1}`);
            setRecentGames(recent);
            random = Math.floor(Math.random() * 10);
            let recommended = await fetchGames(link + `ordering=-metacritic&page=${random + 1}`);
            setRecommendedGames(recommended);
            let reviewsRef = await firestore.collection('reviews').orderBy('createdAt', 'desc').limit(4).get();
            let aux = [];
            reviewsRef.docs.forEach((doc) => {
                aux.push(doc.data());
            });
            setReviews(aux);
        }
        aux();
    }, []);

    useEffect(() => {
        const aux = async () => {
            let topGames = [];
            let topGamesRef = await firestore.collection('games').orderBy('rank', 'asc').limit(5).get();
            topGamesRef.docs.forEach((doc) => {
                topGames.push(doc.data());
            });
            setTopGames(topGames);
            let popularGames = [];
            let popularGamesRef = await firestore.collection('games').orderBy('popularity', 'asc').limit(5).get();
            popularGamesRef.docs.forEach((doc) => {
                popularGames.push(doc.data());
            });
            setPopularGames(popularGames);
        }
        aux();
    }, [])

    useEffect(() => {
        const aux = async () => {
            if (user) {
                let gamesAux = [];
                let userGamesRef = await firestore.collection('userGames').where('userId', '==', user.id).orderBy('timestamp', 'desc').limit(4).get();
                userGamesRef.docs.forEach((doc) => {
                    gamesAux.push(doc.data());
                });
                setUserGames(gamesAux);
            }
        }
        aux();
    }, [user])

    return (
        <div id='home'>
            <h1 id='greet'>Welcome to My Gaming List!</h1>
            <div id='columns'>
                <div className='left'>
                    <GamesCarousel games={recentGames} header={'Recent Games'} slides={4}/>
                    <GamesCarousel games={recommendedGames} header={'Recomended Games'} slides={4}/>
                    <ReviewsComponent reviews={reviews} header={'Latest Games Reviews'}
                        firestore={firestore}/>
                    {user ? <LastUserUpdates games={userGames} firestore={firestore} />: ''}
                </div>
                <div className='right'>
                    <SideList games={topGames} firestore={firestore}
                        header={'Top Games'} link={'/top-games/all-time'} />
                    <SideList games={popularGames} firestore={firestore}
                        header={'Most Popular Games'} link={'/top-games/popular'}/>
                </div>
            </div>
        </div>
    );
};

export default Home;

