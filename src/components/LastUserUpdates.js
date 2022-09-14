import { Link } from 'react-router-dom';
import { useEffect,  useState, useContext } from 'react';
import { UserContext } from './../components/UserContext';
import AddGameButton from './AddGameButton';

const LastUserUpdates = (props) => {

    const { games, firestore } = props;
    
    const user = useContext(UserContext);

    return (
        <div className='section'>
            <h3>My Last List Updates</h3>
            <div>
                {(games !== null) ? 
                games.map(game => {
                    return (
                        <div key={games.indexOf(game)} className='user-game'>
                            <Link className='image' to={`game/${game.gameId}`}>
                                <img src={game.gameImg}></img>
                            </Link>
                            <div className='info'>
                                <div className='top'>
                                    <Link className='title' to={`/game/${game.gameId}`}>{game.gameName}</Link>
                                    <AddGameButton gameData={game} firestore={firestore}
                                        type={'review'}></AddGameButton>
                                </div>
                                <p className='status'>{game.status}</p>
                                <p className='date'>{game.timestamp.toDate().toDateString()} </p>
                            </div>
                        </div>
                    )
                })
                :
                <div className='user-game'>
                    <p className='info'>Your lists are empty!</p> 
                </div>
                }
            </div>
        </div>
    )
};

export default LastUserUpdates;