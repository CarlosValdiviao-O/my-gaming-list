import { Link, useParams } from 'react-router-dom';
import { UserContext } from './../components/UserContext';
import { useContext, useEffect, useRef, useState } from 'react';
import BottomNote from '../components/BottomNote';
import platformsData from '../components/platformsData';
import AddGameButton from '../components/AddGameButton';
import '../components/TopGames.css';
import Image from '../icons/no-image.png';

const TopGames = (props) => {
    const user = useContext(UserContext);
    const { firestore } = props;
    const { platform, type } = useParams();
    const [ games, setGames ] = useState(null);
    const [ lastDoc,  setLastDoc ] = useState(null);
    const [ page, setPage ] = useState(0);
    const [ showPlatforms, setShowPlatforms ] = useState(false);
    const scroll = useRef();
    
    useEffect(() => {
        setPage(0);
        setLastDoc(null);
        setGames(null);
    }, [platform, type]);

    useEffect(() => {
        if (games === null && page === 0)
            fetchGames();
    }, [games, page])

    useEffect(() => {
        setTimeout(() => {
            scroll.current.scrollIntoView({behavior: 'smooth'})
        }, 2000)
    }, [games, page])

    const fetchGames = async () => {
        let gamesRef;
        let aux = [];
        if (type === undefined) {
            if (platform === 'All-Time')
                gamesRef = firestore.collection('games').where('rank', '>=', 1).orderBy('rank', 'asc').startAfter(lastDoc).limit(51);
            else
                gamesRef = firestore.collection('games').where('platforms', 'array-contains', formatPlatform(platform)).orderBy('rank', 'asc').startAfter(lastDoc).limit(51);
        }
        else {
            if (platform === 'All-Time')
                gamesRef = firestore.collection('games').where('popularity', '>=', 1).orderBy('popularity', 'asc').startAfter(lastDoc).limit(51);
            else
                gamesRef = firestore.collection('games').where('platforms', 'array-contains', formatPlatform(platform)).orderBy('popularity', 'asc').startAfter(lastDoc).limit(51);
        }   
        const docs = await gamesRef.get(); 
        if (games !== null) {
            aux = games; 
        }  
        docs.docs.forEach(doc => {
            aux.push(doc.data());
        })
        if (docs.docs.length === 51) {
            setLastDoc(docs.docs[docs.docs.length-2]);
            aux.pop();
        }
        else
            setLastDoc('');
        setGames(aux);
    }

    const loadMore = () => {
        setPage(page + 1);
        if (lastDoc !== '' && page + 1 === (games.length) / 50)
            fetchGames();
    }

    const formatPlatform = (str) => {
        return str.replace('S-X', 'S/X').replace('---', '-/-')
        .replace(/-/g, ' ').replace('8 b', '8-b')
    }
    
    return (
        <div id='top-games'>
            <h1>Top Games</h1>
            <div className='lists-nav'>
                <Link className={(type !== undefined) ? '' : 'current'} to={`/top-games/${platform}`}>By Rank</Link>
                <Link className={(type !== undefined) ? 'current' : ''} to={`/top-games/${platform}/popularity`}>By Popularity</Link>
                <button className={(showPlatforms === true) ? 'current' : ''} onClick={() => setShowPlatforms(!showPlatforms)}>By Platform</button>
            </div>     
            <div className={(showPlatforms === true) ? 'platforms' : 'platforms hide'}>
                {platformsData.map(item => {
                    return (
                        <Link key={platformsData.indexOf(item)} to={`/top-games/${item.replace(/\/| /g, '-')}${(type === undefined) ? '' : '/popularity'}`}
                            className={(item === 'Web' || item === 'Neo Geo') ? 'last' : ''}>{item}</Link>
                    )
                })}
            </div>
            <div className='results-header'>
                <h3>{`Top ${formatPlatform(platform)} Games By ${(type === undefined) ? 'Rank' : 'Popularity'}`}</h3>
                {games ?
                <div className='buttons'>
                    {(page !== 0) ? <button onClick={() => setPage(page - 1)}>{'< Prev 50'}</button> : ''}
                    {(lastDoc !== '' || page + 1 < games.length / 50) ? <button onClick={loadMore}>{'Next 50 >'}</button> : ''}
                </div>
                : ''}
            </div>
            <div ref={scroll}></div>
            <div className='columns'>
                <p className='rank'>Rank</p>
                <p className='title'>Title</p>
                <p className='score'>Score</p>
                <p className='status'>Quick Add/Edit</p>
            </div>
            {games ? 
            <div className='games'>
                {games.map(game => {
                    let index = games.indexOf(game);
                    let platforms = '';
                    game.platforms.forEach(plat => {
                        platforms += plat + ', ';
                        if (game.platforms.indexOf(plat) === game.platforms.length - 1)
                            platforms = platforms.substring(0, platforms.length - 2);
                    })
                    if (index >= page * 50 && index < (page + 1) * 50)
                    return (
                        <div key={index} className='game'>
                            <h4>{index + 1}</h4>
                            <div className='info'>
                                <Link to={`/game/${game.id}/${game.name.replace(/\/| /g, '_')}`} className='image'>
                                    <img src={game.img !== '' ? game.img : Image} alt={game.name}></img>
                                </Link>
                                <div className='right'>
                                    <Link  to={`/game/${game.id}/${game.name.replace(/\/| /g, '_')}`} className='title'>{game.name}</Link>
                                    <p>{platforms}</p>
                                    <p>{game.year}</p>
                                    <p>{`${game.visibleMembers} members`}</p>
                                </div>
                            </div>
                            {(game.visibleScore !== null) ? 
                            <h5><span>★</span>{game.visibleScore.toFixed(2)}</h5>
                            :
                            <h5 className='no-score'><span>★</span>N/A</h5>
                            }
                            <div>
                                {user ? 
                                <AddGameButton gameData={game} firestore={firestore}
                                type='game'/> 
                                :
                                ''}
                            </div>
                        </div>
                    )
                })}
                {(games.length === 0) ? 
                <p>No games found.</p>
                :
                ''}
            </div>
            : ''}
            {games ?
            <div className='buttons'>
                {(page !== 0) ? <button onClick={() => setPage(page - 1)}>{'< Prev 50'}</button> : ''}
                {(lastDoc !== '' || page + 1 < games.length / 50) ? <button onClick={loadMore}>{'Next 50 >'}</button> : ''}
            </div>
            : ''}
            {(lastDoc === '' && page + 1 >= games.length / 50) ? 
            <BottomNote />
            : ''}
        </div>
    );
};

export default TopGames;