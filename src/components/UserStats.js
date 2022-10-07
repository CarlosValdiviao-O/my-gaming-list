import { Link } from 'react-router-dom';
import { useEffect,  useState, useContext } from 'react';
import { UserContext } from './UserContext';

const UserStats = (props) => {

    const { list } = props;
    
    const user = useContext(UserContext);

    return (
        <div className='stats-box'>
            <div className='stats'>
                <h4>{list.name + ' Stats'}</h4>
                <p>Total Entries <span>{list.stats.counter}</span></p>
                <div className='stats-bar'>
                    <div className='playing' style={{width: (380 * list.stats.playing) / list.stats.counter}}></div>
                    <div className='completed' style={{width: (380 * list.stats.completed) / list.stats.counter}}></div>
                    <div className='on-hold' style={{width: (380 * list.stats.onHold) / list.stats.counter}}></div>
                    <div className='dropped' style={{width: (380 * list.stats.dropped) / list.stats.counter}}></div>
                    <div className='plan-to-play' style={{width: (380 * list.stats.planToPlay) / list.stats.counter}}></div>
                </div>
                <div className='stats-data'>
                    <div className='playing'>
                        <div className='circle'></div>
                        <p>Playing</p>
                        <p>{list.stats.playing}</p>
                    </div>
                    <div className='completed'>
                        <div className='circle'></div>
                        <p>Completed</p>
                        <p>{list.stats.completed}</p>
                    </div>
                    <div className='on-hold'>
                        <div className='circle'></div>
                        <p>On-Hold</p>
                        <p>{list.stats.onHold}</p>
                    </div>
                    <div className='dropped'>
                        <div className='circle'></div>
                        <p>Dropped</p>
                        <p>{list.stats.dropped}</p>
                    </div>
                    <div className='plan-to-play'>
                        <div className='circle'></div>
                        <p>Plan to Play</p>
                        <p>{list.stats.planToPlay}</p>
                    </div>  
                </div>
            </div>
            <div className='last-updates'>
                <h4>{`Last ${list.name} Updates`}</h4>
                {list.games.map(game => {
                    return (
                        <div key={list.games.indexOf(game)} className='user-game'>
                            <Link className='image' to={`/game/${game.gameId}/${game.gameName.replace(/\/| /g, '_')}`}>
                                <img src={game.gameImg}></img>
                            </Link>
                            <div className='info'>
                                <Link className='title' to={`/game/${game.gameId}/${game.gameName.replace(/\/| /g, '_')}`}>{game.gameName}</Link>
                                <p className={'status ' + game.status.toLowerCase().replace(/ /g, '-')}><span className='circle'></span>{game.status}</p>
                                <p className='score'>Scored <span>{(game.score !== null) ? game.score : '-'}</span></p>
                                <p className='date'>{game.timestamp.toDate().toDateString()} </p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
};

export default UserStats;