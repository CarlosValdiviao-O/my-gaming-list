import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './../components/UserContext';
import './../components/GamesByYear.css';
import GameCard from '../components/GameCard';
import Spinner from '../icons/spinner.gif';
import BottomNote from '../components/BottomNote';

const GamesByYear = (props) => {

    const { firestore } = props;
    const user = useContext(UserContext);

    const { year } = useParams();
    const [ jumpToVal, setJumpToVal ] = useState('');
    const [ jumpToLink, setJumpToLink ] = useState('');
    const [ games, setGames ] = useState(null);
    const [ lastDoc,  setLastDoc ] = useState(null);
    const [ page, setPage ] = useState(0);

    const scroll = useRef();

    useEffect(() => {
        if (+jumpToVal < today.getFullYear() + 2 && +jumpToVal > 1969)
        setJumpToLink('Go');
        else
        setJumpToLink('');
    }, [jumpToVal]);

    useEffect(() => {
        fetchGames(true);
    }, [year]);

    useEffect(() => {
        setTimeout(() => {
            scroll.current.scrollIntoView({behavior: 'smooth'})
        }, 2000)
    }, [games, page])

    const fetchGames = async (isFirst) => {
        let gamesRef;
        let aux = [];
        if (isFirst === true) {
            setGames(null);
            gamesRef = firestore.collection('games').where('year', '==', +year).orderBy('popularity', 'asc').limit(51);
        }
        else{
            aux = games;
            gamesRef = firestore.collection('games').where('year', '==', +year).orderBy('popularity', 'asc').limit(51).startAfter(lastDoc);
            setGames(null)
        }        
        const docs = await gamesRef.get();
        docs.forEach(doc => {
            aux.push(doc.data());
        })
        if (docs.docs.length === 51) {
            aux.pop();
            setLastDoc(docs.docs[docs.docs.length-2]);
        }
        else
            setLastDoc(null);
        setGames(aux);
    }

    const loadMore = () => {
        setPage(page + 1);
        if (lastDoc !== null && page + 1 === (games.length) / 50)
            fetchGames(false);
    }

    let emptyBoxes = [1,2,3,4,5,6,7,8,9];

    const today = new Date();
    let years = [];
    if (today.getFullYear() === +year)
    years = [+year-4, +year-3, +year-2, +year-1, +year, +year+1];
    else if (today.getFullYear() + 1 === +year)
    years = [+year-5, +year-4, +year-3, +year-2, +year-1, +year];
    else
    years = [+year-3, +year-2, +year-1, +year, +year+1, +year+2];

    return (
        <div id='games-by-year'>
            <h1>Games By Year</h1>
            <div className='years-nav'>
                <div className='years'>
                    {years.map((item) => {
                        let current = (item === +year) ? 'current' : '';
                        return(
                            <Link key={years.indexOf(item)} className={current}
                                to={`/games-by-year/${item}`}>{item}</Link>
                        )
                    })}
                </div>
                <div className='jump-to'>
                    <p>Jump to </p>
                    <input onChange={(e) => setJumpToVal(e.target.value)} 
                        placeholder='Year' maxLength={4}></input>
                    <p><Link className={(jumpToLink === '') ? 'hide' : ''} to={`/games-by-year/${jumpToVal}`}>{jumpToLink}</Link>Go</p>
                </div>
            </div>
            <div ref={scroll}></div>
            <div className='games'>
                {(games !== null) ? 
                games.map(game => {
                    let index = games.indexOf(game);
                    if (index >= page * 50 && index < (page + 1) * 50)
                    return(
                        <GameCard key={games.indexOf(game)} game={game} firestore={firestore} />
                    )
                })
                :
                emptyBoxes.map(box => {
                    return(
                        <div key={box} className='game-card'>
                            <div className='header'>
                                <h4></h4>
                            </div>
                            <div className='content'>
                                <div className='image'><img className='spinner' src={Spinner} alt='spinner'></img></div>
                            </div>
                            <div className='bottom'></div>
                        </div>
                    )
                })}
                {(games !== null && games.length === 0) ?
                <p>No Games Found</p>
                :
                ''}
            </div>
            {(games !== null) ?
                <div className='buttons'>
                    {(page !== 0) ? <button onClick={() => setPage(page-1)}>Previous</button> : ''}
                    {(page !== 0 && (lastDoc !== null || page + 1 < (games.length) / 50)) ? <p>-</p> : ''}
                    {(lastDoc !== null || page + 1 < (games.length) / 50) ? <button onClick={loadMore}>More Games</button> : ''}
                </div>
            : ''}
            <BottomNote />
        </div>
    );
};

export default GamesByYear;
