import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';
import './ReviewComponent.css';
import Image from '../icons/no-image.png';

const ReviewComponent = (props) => {
    const { review, showAll } = props;
    const [ content, setContent ] = useState('');
    const [ isLong, setIsLong ] = useState(false);

    const user = useContext(UserContext);

    useEffect(() => {
        if (isLong == true){
            setContent(review.review);
        }
        else {
            let aux = (review.review.length > 349) ? '... ' : ' ';
            setContent(review.review.substring(0, 349) + aux);
        }
        
    }, [isLong, review])

    useEffect(() => {
        if (showAll === true)
        setIsLong(true);
    }, [showAll]);

    return(
        <div className='review'>
            <Link className='reviewer' to={`/user/${review.userId}/${review.userName.replace(/\/| /g, '_')}`}>
                <img src={review.userImg} alt={review.userName}></img>
            </Link>
            <div className='info'>
                <div className='top'>
                    <Link className='author' to={`/user/${review.userId}/${review.userName.replace(/\/| /g, '_')}`}>{review.userName}</Link>
                    <p className='date'>{review.createdAt.toDate().toDateString()}</p>
                </div>
                <p className={review.recommended.toLowerCase().replace(/ /g, '-')}>{review.recommended}</p>
                <div className='content'><Link to={`/game/${review.gameId}/${review.gameName.replace(/\/| /g, '_')}`} className='game-img'><img src={review.gameImg !== '' ? review.gameImg : Image} alt={review.gameName}></img></Link>{content}</div>
                <p className={(isLong === true) ? 'rating' : 'hide'}>Reviewer's Rating: <span>{review.rating}</span></p>
                <div className='bottom'>
                    <button className={(isLong === true) ? 'show-less' : 'read-more'} onClick={() => setIsLong(!isLong)}>
                        {(isLong === true) ? 'Show Less' : 'Read More'}</button>
                    <Link to={`/review/${review.id}`}>Open</Link>
                    {(user && review.userId === user.id) ? 
                    <Link className='edit' to={`/review/${review.id}/editor/${review.gameId}/${review.gameName.replace(/\/| /g, '_')}`}>Edit</Link>
                    : ''}
                </div>
            </div>
        </div>
    )
}

export default ReviewComponent;