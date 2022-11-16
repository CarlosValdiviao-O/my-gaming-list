import { Link, useParams } from 'react-router-dom';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './../components/UserContext';
import UserGame from '../components/UserGame';
import Spinner from '../icons/spinner-black.gif';
import '../components/UserList.css';

const UserList = (props) => {
    const user = useContext(UserContext);
    const { firestore } = props;
    const [ games, setGames ] = useState(null);
    const [ filteredGames, setFilteredGames ] = useState(null);
    const [ lastDoc,  setLastDoc ] = useState('');
    const [ shared, setShared ] = useState(0);
    const { id, list, name } = useParams();
    const [ filter, setFilter ] = useState('all');
    const [ order, setOrder ] = useState('name');
    const [ loading, setLoading ] = useState(true);

    const filters = [
        {
            name: 'All Games', 
            val: 'all',
        },
        {
            name: 'Currently Playing', 
            val: 'Playing',
        },
        {
            name: 'Completed', 
            val: 'Completed',
        },
        {
            name: 'On Hold', 
            val: 'On-Hold',
        },
        {
            name: 'Dropped', 
            val: 'Dropped',
        },
        {
            name: 'Plan to Play', 
            val: 'Plan to Play',
        }
    ]

    const observer = useRef();
    const lastElement = useCallback(node => {
        if (loading) return
        if (observer.current) observer.current.disconnect()
        observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && lastDoc) {
            fetchGames()
        }
        })
        if (node) observer.current.observe(node)
    }, [loading, lastDoc])

    useEffect(() => {
        setLastDoc('');
        setGames(null);
        setFilteredGames(null);
        setShared(0);
        setOrder('name');
        setFilter('all');
        setLoading(true);
    }, [id, list]);

    useEffect(() => {
        if (games === null)
            fetchGames();
    }, [games])

    useEffect(() => {
        if (games !== null) {
            applyChanges();
        }
    }, [games, filter, order])

    useEffect(() => {
        if (user && games) {
            let aux = 0;
            user.games.forEach(userGame => {
                games.forEach(game => {
                    if (game.gameId === userGame)
                        aux++;
                })
            })
            setShared(aux);
        }
    }, [user, games])

    const fetchGames = async () => {
        setLoading(true);
        let gamesRef;
        let aux = [];
        if (list === 'All-Games')
            gamesRef = firestore.collection('userGames').where('userId', '==', id).orderBy('gameName', 'asc').startAfter(lastDoc).limit(51);
        else
            gamesRef = firestore.collection('userGames').where('userId', '==', id).where('platforms', 'array-contains', formatPlatform(list)).orderBy('gameName', 'asc').startAfter(lastDoc).limit(51); 
        const docs = await gamesRef.get(); 
        if (games !== null) {
            aux = games; 
        }  
        docs.docs.forEach(doc => {
            aux.push(doc.data());
        })
        setLoading(false);
        if (docs.docs.length === 51) {
            setLastDoc(docs.docs[docs.docs.length-2]);
            aux.pop();
        }
        else
            setLastDoc(null);
        setGames(state => ([...aux]));
    }

    const applyChanges = () => {
        let aux = games;
        if (filter !== 'all')
            aux = filterGames(aux);
        aux = orderGames(aux);
        setFilteredGames(state => ([...aux]));
    }

    const filterGames = (arr) => {
        let aux = [];
        arr.map(game => {
            if (game.status === filter)
                aux.push(game);
        })
        return aux;
    }

    const orderGames = (arr) => {
        let aux = arr;
        if (order === 'name') {
            aux.sort(function (a, b) {      
            let x = a.gameName.toLowerCase();
            let y = b.gameName.toLowerCase();
            if (x < y) {return -1;}
            if (x > y) {return 1;}
            return 0;
            })
        }
        if (order === 'nameR') {
            aux.sort(function (a, b) {      
            let x = a.gameName.toLowerCase();
            let y = b.gameName.toLowerCase();
            if (x < y) {return 1;}
            if (x > y) {return -1;}
            return 0;
            })
        }
        if (order === 'scoreR') {
            aux.sort(function (a, b) {
                return a.score - b.score;
            })
        }
        if (order === 'score') {
            aux.sort(function (a, b) {
                return b.score - a.score;
            })
        }
        return aux;
    }

    const formatPlatform = (str) => {
        return str.replace('S-X', 'S/X').replace('---', '-/-')
        .replace(/-/g, ' ').replace('8 b', '8-b')
    }

    return (
       <div id='user-list'>
            <div className='header'>
                <div className='top-box'>
                    {(user && user.id === id) ? 
                    <p>Viewing <strong>Your</strong> {formatPlatform(list)} List</p>
                    :
                    <p>Viewing <Link to={`/user/${id}/${name}`}>{name.replace(/_/g, ' ')}'s</Link> {formatPlatform(list)} List</p>}
                    {(user && user.id !== id) ?
                    <p><strong>{shared}</strong> Shared Games</p>
                    :
                    ''}
                </div>
                <div className='mgl'>
                    My Gaming List
                </div>
            </div>
            {(filteredGames) ?
            <div>
                <div className='filters'>
                    {filters.map(item => {
                        return (
                            <button key={filters.indexOf(item)} onClick={() => setFilter(item.val)}
                                className={(filter === item.val) ? 'current' : ''}>{item.name}</button>
                        )
                    })}
                </div>
                <h3 className='list-header'>
                    {filters.map(item => {
                        if (item.val === filter)
                            return item.name.toUpperCase();
                    })}
                </h3>
                <div className='columns'>
                    <p className='num'>#</p>
                    <p className='image'>Image</p>
                    <button className='name' onClick={() => (order === 'name') ? setOrder('nameR') : setOrder('name')}>Game Title</button>
                    <button className='score' onClick={() => (order === 'score') ? setOrder('scoreR') : setOrder('score')}>Score</button>
                    <p className='genres'>Genres</p>
                </div>
                <div className='games'>
                    {filteredGames.map(game => {
                        let index = filteredGames.indexOf(game);
                        if (index + 1 === filteredGames.length)
                            return (
                                <div key={index} ref={lastElement}>
                                    <UserGame game={game} number={index + 1} firestore={firestore}/>
                                </div>
                            )
                        else
                            return (
                                <div key={index}>
                                    <UserGame game={game} number={index + 1} firestore={firestore}/>
                                </div>
                            )
                    })}
                </div>
            </div>
            : ''}
            {loading && 
                <div className='loading'>
                    <img src={Spinner} alt={'Loading..'}></img>       
                </div>
            }
       </div>
    );
};

export default UserList;
