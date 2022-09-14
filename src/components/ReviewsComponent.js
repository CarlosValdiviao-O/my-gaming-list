import { Link } from 'react-router-dom';
import { useContext } from 'react';
import './ReviewsComponent.css';
import { UserContext } from './../components/UserContext';
import AddGameButton from './AddGameButton';

const ReviewsComponent = (props) => {
    const { reviews, header, firestore} = props;
    
    const user = useContext(UserContext);

    return (
        <div className='section'>
            <h3>{header}</h3>
            <div>
                {(reviews !== null) ?
                    reviews.map(review => {
                        let aux = (review.review.lenght > 349) ? '... ' : ' ';
                        return(
                            <div className='review' key={reviews.indexOf(review)}>
                                <Link className='image' to={`/game/${review.gameId}`}>
                                    <img src={review.gameImg} alt={review.gameName}></img>
                                </Link>
                                <div className='info'>
                                    <div className='top'>
                                        <Link className='title' to={`/game/${review.gameId}`}>{review.gameName}</Link>
                                        {user ? <AddGameButton gameData={review} firestore={firestore}
                                                   type={'review'}></AddGameButton> : ''}
                                        <p className='rating'>{`Overall Rating: ${review.rating}`}</p>
                                    </div>
                                    <p className='content'>{review.review.substring(0, 350) + aux}
                                        <Link className='read-more' to={`/review/${review.id}`}>read more</Link></p>
                                    <p className='bottom'>{review.createdAt.toDate().toDateString() + ' by '} 
                                        <Link className='author' to={`/user/${review.userId}`}>{review.userName}</Link></p>
                                </div>
                            </div>
                        )
                    })
                :
                <div className='review'>
                    <p className='content'>No reviews yet, be the first!</p>
                </div>
                } 
            </div>
            
            
        </div>
    );
};

export default ReviewsComponent;