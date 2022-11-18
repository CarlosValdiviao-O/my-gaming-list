import { useEffect,  useState, useContext, useRef } from 'react';
import { UserContext } from './UserContext';
import ReviewComponent from './ReviewComponent';
import { Link } from 'react-router-dom';
import uniqid from 'uniqid';
import Spinner from '../icons/spinner.gif';

const AllGameReviews = (props) => {

    const { game, firestore } = props;
    
    const [ reviews, setReviews ] = useState(null);
    const [ lastDoc,  setLastDoc ] = useState(null);
    const [ page, setPage ] = useState(0);
    const [ userReview, setUserReview ] = useState(null);
    
    const user = useContext(UserContext);

    const scroll = useRef();

    useEffect(() => {
        const fetchUserReview = async () => {
            const reviewRef = firestore.collection('reviews').where('gameId', '==', game.id).where('userId', '==', user.id).limit(1);
            const docs = await reviewRef.get();
            let exists = false;
            docs.forEach(doc => {
                exists = true;
                setUserReview(doc.data());
            })
            if (exists === false) 
            setUserReview('')
        }
        if (user && game.reviewers.includes(user.id))
        fetchUserReview();
    }, [user])

    useEffect(() => {
        fetchReviews(true);
    }, [])

    useEffect(() => {
        setTimeout(() => {
            scroll.current.scrollIntoView({behavior: 'smooth'})
        }, 2000)
    }, [reviews, page])

    const fetchReviews = async (isFirst) => {
        let aux = [];
        let reviewsRef;
        if (isFirst === true)
        reviewsRef = firestore.collection('reviews').where('gameId', '==', game.id).orderBy('createdAt', 'desc').limit(10);
        else {
            reviewsRef = firestore.collection('reviews').where('gameId', '==', game.id).orderBy('createdAt', 'desc').limit(10).startAfter(lastDoc);
            aux = reviews;
        }        
        const docs = await reviewsRef.get();
        docs.forEach(doc => {
            aux.push(doc.data());
        })
        setLastDoc(docs.docs[docs.docs.length-1]);
        setReviews(aux);
    }

    const loadMore = () => {
        setPage(page + 1);
        if (game.reviews > reviews.length)
            fetchReviews(false);
    }

    if (reviews !== null)
    return (
        <div className='reviews-tab' > 
            <h4>Reviews <span>
                {(user && !game.reviewers.includes(user.id)) ? 
                    <Link className='new-review' to={`/review/${uniqid()}/editor/${game.id}/${game.name.replace(/\/| /g, '_')}`}>Write a review</Link> : ''} 
                </span>
            </h4>   
            <div ref={scroll}></div>                    
            {(reviews.length > 0) ?
                <div className='reviews'>
                    {reviews.map(review => {
                    let index = reviews.indexOf(review);
                    if (index >= page * 10 && index < (page + 1) * 10) {
                        if (user && review.userId !== user.id)
                        return(
                            <ReviewComponent review={review} key={index} />
                        )
                        else 
                        if (user === null)
                        return(
                            <ReviewComponent review={review} key={index} />
                        )
                    } 
                    
                    })}
                    {(user && userReview !== null && userReview !== '') ?
                    <div className='user-review'>
                        <ReviewComponent review={userReview} />
                    </div>
                    :
                    ''}
                </div>
            :
                <div className='no-reviews'>
                    <p>No reviews yet, be the first!</p>
                </div>
            } 
            <div className='pages-nav'>
                {(page !== 0) ? <button onClick={() => setPage(page-1)}>Previous</button> : ''}
                {(page !== 0 && game.reviews > (page + 1) * 10) ? <p>-</p> : ''}
                {(game.reviews > (page + 1) * 10) ? <button onClick={loadMore}>More Reviews</button> : ''}
            </div>          
        </div>
    )
    else 
    return (
        <div className='reviews-tab'>
            <h4 id='loading'><span><img src={Spinner} alt='spinner-gif'></img></span>Loading...</h4>
        </div>
    )
};

export default AllGameReviews;