import { Link } from 'react-router-dom';
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
    const { firebase, updateUserData } = props;
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
            });
            setReviews(aux);
        }
        aux();
    }, []);

    useEffect(() => {
        const aux = async () => {
            let topGames = [];
            let topGamesRef = await firestore.collection('games').orderBy('avgScore', 'desc').limit(5).get();
            topGamesRef.docs.forEach((doc) => {
                topGames.push(doc.data());
            });
            setTopGames(topGames);
            let popularGames = [];
            let popularGamesRef = await firestore.collection('games').orderBy('members', 'desc').limit(5).get();
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
                    <GamesCarousel games={recentGames} header={'Recent Games'} />
                    <GamesCarousel games={recommendedGames} header={'Recomended Games'} />
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

