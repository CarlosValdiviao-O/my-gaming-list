import { useContext } from 'react';
import { UserContext } from './../components/UserContext';
import ReviewComponent from './ReviewComponent';

const GameReviews = (props) => {
    const { reviews } = props;
    
    const user = useContext(UserContext);

    return (
        <div className='reviews'>
            {(reviews.length > 0) ?
                reviews.map(review => {
                    return(
                        <ReviewComponent review={review} key={reviews.indexOf(review)} />
                    )
                })
            :
            <div className='no-reviews'>
                <p>No reviews yet, be the first!</p>
            </div>
            } 
        </div>        
    );
};

export default GameReviews;