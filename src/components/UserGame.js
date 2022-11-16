import { Link } from 'react-router-dom';
import { useState, useContext } from 'react';
import { UserContext } from './UserContext';
import AddGameButton from './AddGameButton';

const UserGame = (props) => {
    const { game, firestore, number } = props;

    const user = useContext(UserContext);

    let genres = '';
    game.genres.forEach(genre => {
        genres += genre + ', ';
        if (game.genres.indexOf(genre) === game.genres.length - 1)
            genres = genres.substring(0, genres.length - 2);
    })
    
    return(
        <div className='user-game'>
            <div className={`bar ${game.status.replace(/ /g, '-').toLowerCase()}`}></div>
            <p className='number'>{number}</p>
            <div className='image-container'>
                <div className='image'>
                    <Link to={`/game/${game.gameId}/${game.gameName.replace(/\/| /g, '_')}`}><img src={game.gameImg} alt={game.gameName}></img></Link>
                </div>
            </div>
            <div className='name'>
                <Link to={`/game/${game.gameId}/${game.gameName.replace(/\/| /g, '_')}`}>{game.gameName}</Link>
            </div>
            <div className='buttons'>
                {user ? 
                <AddGameButton gameData={game} firestore={firestore}
                type='review'/> 
                :
                ''}
            </div>
            <p className='score'>{game.score ? game.score : '-'}</p>
            <p className='genres'>{genres}</p>
        </div>
    )
}

export default UserGame;