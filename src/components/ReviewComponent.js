import { Link } from 'react-router-dom';
import { useEffect, useState, useContext } from 'react';
import { UserContext } from './UserContext';

const ReviewComponent = (props) => {
    const { review } = props;
    const [ content, setContent ] = useState('');
    const [ isLong, setIsLong ] = useState(false);

    const user = useContext(UserContext);

    useEffect(() => {
        if (isLong == true){
            setContent(review.review);
        }
        else {
            let aux = (review.review.lenght > 349) ? '... ' : ' ';
            setContent(review.review.substring(0, 349) + aux);
        }
        
    }, [isLong])
    return(
        <div className='review'>
            <Link className='reviewer' to={`/user/${review.userId}`}>
                <img src={review.userImg} alt={review.userName}></img>
            </Link>
            <div className='info'>
                <div className='top'>
                    <Link className='author' to={`/user/${review.userId}`}>{review.userName}</Link>
                    <p className='date'>{review.createdAt.toDate().toDateString()}</p>
                </div>
                <p className={review.recommended.toLowerCase().replace(/ /g, '-')}>{review.recommended}</p>
                <p className='content'>{content}</p>
                <p className={(isLong === true) ? 'rating' : 'hide'}>Reviewer's Rating: <span>{review.rating}</span></p>
                <div className='bottom'>
                    <button className={(isLong === true) ? 'show-less' : 'read-more'} onClick={() => setIsLong(!isLong)}>
                        {(isLong === true) ? 'Show Less' : 'Read More'}</button>
                    <Link to={`/review/${review.id}`}>Open</Link>
                    {(user && review.userId === user.id) ? 
                    <Link className='edit' to={`/review/${review.id}/editor`}>Edit</Link>
                    : ''}
                </div>
            </div>
        </div>
    )
}

export default ReviewComponent