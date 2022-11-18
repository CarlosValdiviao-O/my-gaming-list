import { Link, useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from './../components/UserContext';
import '../components/Profile.css';
import Spinner from '../icons/spinner.gif';
import UserStats from '../components/UserStats';

const Profile = (props) => {
    const { firebase } = props;
    const user = useContext(UserContext);
    const { id } = useParams();
    const [ userData, setUserData ] = useState(null);
    const [ userLists, setUserLists ] = useState(null);

    const firestore = firebase.firestore();

    useEffect(() => {
        setUserData(null);
        const aux = async () => {
            const userRef = firestore.collection('users').doc(id);
            let doc = await userRef.get();
            setUserData(doc.data());             
        }
        aux();
    }, [id]);

    useEffect(() => {
        const aux = async () => {
            if (userData !== null) {
                let listsAux = [];
                let gamesAux = [];
                let userGamesRef = await firestore.collection('userGames').where('userId', '==', id).orderBy('timestamp', 'desc').limit(20).get();
                userGamesRef.docs.forEach((doc) => {
                    gamesAux.push(doc);
                });
                userData.lists.forEach(async list => {
                    let latestGames = await filterLatestGames(list, gamesAux);
                    listsAux.push({
                        name: list,
                        stats: userData.stats[toCamelCase(list)],
                        games: latestGames,
                    })
                })
                setUserLists(listsAux);
            }
            else
            setUserLists(null)
        }
        aux();
    }, [userData])

    function toCamelCase(str) {
        return str.replace('-', ' ').replace(/(?:^\w|[A-Z]|\b\w|\s+|\/)/g, function(match, index) {
            if (+match === 0) return ""; 
            return index === 0 ? match.toLowerCase() : match.toUpperCase();
        })
    }

    async function filterLatestGames(list, games) {
        let gamesAux = [];
        let lastDoc = null;
        for (let i = 0; i < games.length; i++) {
            if (gamesAux.length < 3) {
                if(games[i].data().platforms.includes(list) || list === 'All Games') {
                   gamesAux.push(games[i].data());
                   lastDoc = games[i];
                }
            }
            else {
                break;
            }
        }
        if (userData.stats[toCamelCase(list)].counter > gamesAux.length && gamesAux.length < 3) {
            let userGamesRef;
            if (gamesAux.length === 0)
                userGamesRef = firestore.collection('userGames').where('userId', '==', id).where('platforms', 'array-contains', list).orderBy('timestamp', 'desc').limit(3);
            else 
                userGamesRef = firestore.collection('userGames').where('userId', '==', id).where('platforms', 'array-contains', list).orderBy('timestamp', 'desc').startAfter(lastDoc).limit(3 - gamesAux.length);
            let gamesDocs = await userGamesRef.get();
            gamesDocs.docs.forEach((doc) => {
                games.push(doc.data());
                gamesAux.push(doc.data());
            }); 
        }
        return gamesAux;
    }
    
    if (userData !== null)
    return (
        <div id='profile'>
            <h1>{userData.name + `'s Profile`}</h1>
            <div id='columns'>
                <div className='left'>
                    <div className='image'>
                        <img src={userData.pic} alt={userData.name}></img>
                    </div>
                    <h4>Lists</h4>
                    <div className='lists'>                        
                        {userData.lists.map(list => {
                            return(
                                <Link key={userData.lists.indexOf(list)} className='list' to={`/list/${list.toLowerCase().replace(/\/| /g, '-')}/${userData.id}/${userData.name.replace(/\/| /g, '_')}`}>{list}</Link>
                            )
                        })}
                    </div>
                    <Link className='reviews' to={`/reviews/${userData.id}/${userData.name.replace(/\/| /g, '_')}`}>Reviews<span>{userData.reviews}</span></Link>
                </div>
                <div className='right'>
                    <div className='stats'>
                        <h4>Statistics</h4> 
                        {(userLists !== null) ? userLists.map(list => {
                            return (
                                <UserStats key={userLists.indexOf(list)} list={list} />
                            )
                        })
                        : ''}                              
                    </div>
                </div>
            </div>
        </div>
    );
    else
    return (
        <div id='profile'>
            <h1 id='loading'><span><img src={Spinner} alt='spinner-gif'></img></span>Loading...</h1>
        </div>
    )
};

export default Profile;
