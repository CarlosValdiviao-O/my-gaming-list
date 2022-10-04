import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import AddGameButton from './AddGameButton';
import Icon from './../icons/user.svg';

const GameCard = (props) => {
    const { game, firestore } = props;
    const [ isLong, setIsLong ] = useState(false);

    const user = useContext(UserContext);
    let date = (game.releaseDate !== 'TBA') ? new Date(game.releaseDate).toDateString() : 'TBA';
    
    let score = (game.visibleScore !== undefined && game.visibleScore !== null) ? game.visibleScore.toFixed(2) : '~';
    let members = (game.visibleMembers !== undefined) ? game.visibleMembers : '~';
    return(
        <div className='game-card'>
            <div className='header'>
                <h4><Link to={`/game/${game.id}`}>{game.name}</Link></h4>
                <p className='date'>{date}</p>
                <div className='genres'>
                    {game.genres.map(genre => {
                        return (
                            <p key={game.genres.indexOf(genre)}>{genre}</p>
                        )
                    })}
                </div>
            </div>
            <div className='content'>
                <Link to={`/game/${game.id}`} className='image'>
                    <img src={game.img} alt={game.name}></img>
                </Link>
                <div className='info'>
                    <div className={(isLong === true) ? 'long' : 'short'} dangerouslySetInnerHTML={{__html: game.description}}></div>
                    <button onClick={() => setIsLong(!isLong)}>{(isLong === true) ? '▴' : '▾'}</button>
                    <p><span>Platforms: </span>{game.platforms.map(platform => {
                        let trimmed = platform.toLowerCase().replace(/ /g, '-').replace('/', '-');
                        return ( 
                            <Link key={game.platforms.indexOf(platform)} to={`/top-games/${trimmed}`}>{platform}</Link>
                        )
                    })}</p>
                </div>
            </div>
            <div className='bottom'>
                <p className='score'><span>☆</span>{score}</p>
                <p className='members'><img src={Icon} alt='user-icon'></img>{members}</p>
                <div className='buttons'>
                    {user ? <AddGameButton gameData={game} firestore={firestore}
                        type='game'/> : ''}
                </div>
            </div>
        </div>
    )
}

export default GameCard;