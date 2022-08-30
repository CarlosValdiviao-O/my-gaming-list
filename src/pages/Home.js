import { Link } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import { UserContext } from './../components/UserContext';
import './../components/Home.css'
import GamesCarrusel from '../components/GamesCarrusel';

const Home = () => {
    const user = useContext(UserContext);
    const link = 'https://api.rawg.io/api/games';
    let today = new Date('2020-07-31');
    let sixMonthsAgo = new Date(today);
    if (today.getMonth() < 6) {
        sixMonthsAgo.setMonth(today.getMonth() + 6);
        sixMonthsAgo.setFullYear(today.getFullYear() - 1);
    }
    else {
        sixMonthsAgo.setMonth(today.getMonth() - 6);
    }
    console.log({today: today, prev: sixMonthsAgo})

    return (
        <div id='home'>
            <h1 id='greet'>Welcome to My Gaming List!</h1>
            <div className='left'>
                <GamesCarrusel link={link}/>
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
