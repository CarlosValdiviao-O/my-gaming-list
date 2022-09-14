import { Link } from 'react-router-dom';
import { useEffect,  useState, useContext } from 'react';
import { UserContext } from './UserContext';
import AddGameButton from './AddGameButton';

const SideList = (props) => {

    const { games, firestore, header, link } = props;
    
    const user = useContext(UserContext);

    return (
        <div className='sidelist'>
            <div className='header'>
                <h3>{header}</h3>
                <Link to={link}>More</Link>
            </div>
            <div className='games'>
                {(games !== null) ? 
                games.map(game => {
                    let score = (game.avgScore !== null) ? Math.floor(game.avgScore * 100) / 100 : 'pending';
                    return (
                        <div key={games.indexOf(game)} className='game'>
                            <h4>{games.indexOf(game) + 1}</h4>
                            <Link className='image' to={`game/${game.id}`}>
                                <img src={game.img}></img>
                            </Link>
                            <div className='info'>
                                <div className='top'>
                                    <Link className='title' to={`/game/${game.id}`}>{game.name}</Link>
                                    <AddGameButton gameData={game} firestore={firestore}
                                        type={'game'}></AddGameButton>
                                </div>
                                <p>{'Scored ' + score}</p>
                                <p>{`${game.members} members`}</p>
                            </div>
                        </div>
                    )
                })
                :
                <div className='game'>
                    <p className='info'>Loading Games</p> 
                </div>
                }
            </div>
        </div>
    )
};

export default SideList;