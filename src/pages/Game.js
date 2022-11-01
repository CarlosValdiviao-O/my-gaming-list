import { Link, useParams } from 'react-router-dom';
import { useContext, useState, useEffect, useRef } from 'react';
import { UserContext } from './../components/UserContext';
import './../components/Game.css';
import QuickAdd from '../components/QuickAdd';
import ImagesCarousel from '../components/ImagesCarousel';
import GameReviews from '../components/GameReviews';
import AllGameReviews from '../components/AllGameReviews';
import GamesCarousel from '../components/GamesCarousel';
import Spinner from '../icons/spinner.gif';
import Image from './../icons/no-image.png';

const Game = (props) => {
    const { firebase, tab } = props;
    const user = useContext(UserContext);
    const { id } = useParams();
    const [ game, setGame ] = useState(null);
    const [ showDropdown , setShowDropdown ] = useState(false);
    const [ userDoc, setUserDoc ] = useState(null);
    const [ reviews, setReviews ] = useState([]);

    const link = `https://api.rawg.io/api/games/${id}`;
    const getRAWG = firebase.functions().httpsCallable('getRAWG');
    const firestore = firebase.firestore();

    useEffect(() => {
        setGame(null);
        const aux = async () => {
            const gameRef = firestore.collection('games').doc(id);
            let doc = await gameRef.get();
            if (doc.exists) {
               setGame(doc.data()); 
            }
            else {
                let rawgGame = await getRAWG({link: link + '?'});
                formatGameData(JSON.parse(rawgGame.data)) ;
            }
        }
        aux();
    }, [id]);

    useEffect(() => {
        setReviews([]);
        const fetchReviews = async () => {
            let aux = [];
            const reviewsRef = firestore.collection('reviews').where('gameId', '==', id).orderBy('createdAt', 'desc').limit(3);
            const docs = await reviewsRef.get();
            docs.forEach(doc => {
                aux.push(doc.data());
            })
            setReviews(aux);
        }
        fetchReviews();
    }, [id])

    useEffect(() => {
        const aux = async () => {
            const userGameRef = firestore.collection('userGames').where('gameId', '==', id).where('userId', '==', user.id);
            const docSnapshot = await userGameRef.get();
            docSnapshot.forEach(docSnap => {
                docSnap.ref.onSnapshot(doc => {
                    setUserDoc(doc)
                })
            })
        } 
        if (user)
        aux();
    }, [user])

    const formatGameData = async (data) => {
        let familyGames = await getRAWG({link: link + '/game-series?'});
        let familyGamesVal = JSON.parse(familyGames.data);
        let familyGamesArr = [];
        familyGamesVal.results.forEach(item => {
            familyGamesArr.push({
                id: item.id,
                img: item.background_image,
                name: item.name,
            })
        })
        let screenshots = await getRAWG({link: link + '/screenshots?'});
        let screenshotsVal = JSON.parse(screenshots.data);
        let screenshotsArr = [];
        screenshotsVal.results.forEach(item => {
            screenshotsArr.push(item.image);
        })
        let trailer = await getRAWG({link: link + '/movies?'});
        let trailerVal = JSON.parse(trailer.data);
        let trailerLink = (trailerVal.count > 0) ? trailerVal.results[0].data.max : null;

        let platforms = [];
        let genres = [];
        if (data.platforms !== null) {
            data.platforms.forEach(platform => {
                platforms.push(platform.platform.name)
            })
        }
        if (data.genres !== null) {
            data.genres.forEach(genre => {
                genres.push(genre.name)
            })
        }
        setGame({
            description: data.description.replace(/<\/p>\n<p>/g, '<br />'),
            genres: genres,
            familyGames: familyGamesArr,
            id: id,
            img: data.background_image,
            name:data.name,
            platforms: platforms,
            releaseDate: (data.tba === false) ? data.released : 'TBA',
            screenshots: screenshotsArr,
            trailerLink: trailerLink,
            score: 0,
            visibleScore: '~',
            numberOfScores: '~',
            reviews: 0,
            reviewers: [],
        })
    }
    if (game !== null){
        let genres = '';
        game.genres.forEach(genre => {
            genres += genre + ', ';
        })
        let platforms = '';
        game.platforms.forEach(platform => {
            platforms += platform + ', ';
        })
        let date = (game.releaseDate !== 'TBA') ? new Date(game.releaseDate).toDateString() : 'TBA';
        let year = (game.releaseDate !== 'TBA') ? new Date(game.releaseDate).getFullYear() : 'TBA';
        let score = (game.visibleScore !== undefined && game.visibleScore !== null && game.visibleScore !== '~') ? game.visibleScore.toFixed(2) + ` (scored by ${game.numberOfScores} members)` : `~`;
        let rank = (game.rank !== undefined) ? game.rank : '~';
        let popularity = (game.popularity !== undefined) ? game.popularity : '~';
        let members = (game.visibleMembers !== undefined) ? game.visibleMembers : '~';
        return (
            <div id='game-page'>
                <h1>{game.name}</h1>
                <div id='columns'>
                    <div className='left'>
                        <div className='image'>
                            <img src={(game.img !== null) ? game.img : Image} alt={game.name}></img>
                        </div>
                        {(user) ? 
                        (user.games.includes(id)) ?
                            <QuickAdd game={game} firestore={firestore} type='side'
                                userDoc={userDoc}/>
                            : 
                            <div className='dropdown'>
                                <button onClick={() => setShowDropdown(!showDropdown)}>Add to My List</button>
                                <QuickAdd game={game} firestore={firestore} type={(showDropdown === true) ? 'side' : 'side hide'}
                                    userDoc={userDoc}/>                            
                            </div>
                        :
                        <div>
                            <p className='no-user'>Logg-In/Sign-Up to add this game to your list</p>
                        </div>}
                        <div className='info'>
                            <h4>Information</h4>
                            <p><span>Genres: </span>{genres.substring(0, genres.length - 2)}</p>
                            <p><span>Platforms: </span>{platforms.substring(0, platforms.length - 2)}</p>
                            <p><span>Release Date: </span>{date}</p>
                        </div>
                        <div className='info statistics'>
                            <h4>Statistics</h4>
                            <p><span>Score: </span>{score}</p>
                            <p><span>Ranked: </span>{`#${rank}`}</p>
                            <p><span>Popularity: </span>{`#${popularity}`}</p>
                            <p><span>Members: </span>{members}</p>
                        </div>
                    </div>
                    <div className='right'>
                        <div className='tabs'>
                            <Link to={`/game/${id}/${game.name.replace(/\/| /g, '_')}`} className={(tab === 'details') ? 'current' : ''}>Details</Link>
                            <Link to={`/game/${id}/${game.name.replace(/\/| /g, '_')}/reviews`} className={(tab === 'reviews') ? 'current' : ''}>Reviews</Link>
                        </div>
                        <div className={(tab === 'details') ? 'details' : 'details hide'}>
                            <div className='top'>
                                <div className='left'>
                                    <div className='statistics'>
                                        <div className='score'>
                                            <h5>SCORE</h5>
                                            <h3>{(game.visibleScore !== undefined && game.visibleScore !== null && game.visibleScore !== '~')  ? game.visibleScore.toFixed(2) : '~'}</h3>
                                            <p>{game.numberOfScores + ' users'}</p>
                                        </div>
                                        <div className='ranks'>
                                            <div className='ranks'>
                                                <p><span>Ranked </span>{`#${rank}`}</p>
                                                <p><span>Popularity </span>{`#${popularity}`}</p>
                                                <p><span>Members </span>{members}</p>
                                            </div>
                                            <div className='info'>
                                                {(year !== 'TBA') ?
                                                <Link to={`/games-by-year/${year}`}>{year}</Link>
                                                :
                                                <p>{year}</p>}
                                                <div className='platforms'>
                                                    {(game.platforms.map(platform => {
                                                        let link = platform.replace(/\/| /g, '-');                                            
                                                        return(
                                                            <Link key={game.platforms.indexOf(platform)} to={`/top-games/${link}`}>{platform}</Link>
                                                        )
                                                    }))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(user) ?
                                    <QuickAdd game={game} firestore={firestore} type='center'
                                        userDoc={userDoc}/>
                                    :
                                    <div className='no-user'>
                                        <p>Log-In/Sign-Up to add this game to your lists!</p>
                                    </div>}
                                </div>
                                <div className='right'>
                                    {(game.trailerLink) ?
                                    <video width={240} height={135} controls>
                                        <source src={game.trailerLink} type='video/mp4'></source>
                                    </video>
                                    :
                                    ''}
                                </div>
                            </div>
                            <div className='description'>
                                <h4>Description</h4>
                                <div dangerouslySetInnerHTML={{__html: game.description}}></div>
                            </div>
                            <div className='screenshots'>
                                <h4>Screenshots</h4>
                                <ImagesCarousel images={game.screenshots}/>        
                            </div>
                            <div className='reviews'>
                                <h4>Reviews</h4>
                                <GameReviews reviews={reviews}/>
                            </div>
                            {(game.familyGames.length > 0) ?
                                <div className='family-games'>
                                    <GamesCarousel games={game.familyGames} header={'Related Games'} slides={4}/>
                                </div>
                            : ' '}
                        </div>
                        {(tab === 'reviews') ? 
                        <AllGameReviews game={game} firestore={firestore} /> 
                        : ''}
                    </div>
                </div>
                
            </div>
        );
    }
    
    else
    return (
        <div id='game-page'>
            <h1 id='loading'><span><img src={Spinner} alt='spinner-gif'></img></span>Loading...</h1>
        </div>
    )
};

export default Game;
