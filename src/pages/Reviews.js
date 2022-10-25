import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import ReviewComponent from '../components/ReviewComponent';
import '../components/Reviews.css';
import { UserContext } from './../components/UserContext';
import AddGameButton from '../components/AddGameButton';

const Reviews = (props) => {
    const user = useContext(UserContext);
    const { firestore } = props;
    const [ reviews, setReviews ] = useState(null);
    const [ lastDoc,  setLastDoc ] = useState(null);
    const [ page, setPage ] = useState(0);

    const scroll = useRef();
    
    useEffect(() => {
       fetchReviews(true) 
    }, []);

    useEffect(() => {
        setTimeout(() => {
            scroll.current.scrollIntoView({behavior: 'smooth'})
        }, 2000)
    }, [reviews, page])

    const fetchReviews = async (isFirst) => {
        let reviewsRef;
        let aux = [];
        if (isFirst === true) {
            setReviews(null);
            reviewsRef = firestore.collection('reviews').orderBy('createdAt', 'desc').limit(21);
        }
        else {
            aux = reviews;
            reviewsRef = firestore.collection('reviews').orderBy('createdAt', 'desc').limit(21).startAfter(lastDoc);
            setReviews(null);
        }        
        const docs = await reviewsRef.get();
        docs.forEach(doc => {
            aux.push(doc.data());
        })
        if (docs.docs.length === 21)
            setLastDoc(docs.docs[docs.docs.length-2]);
        else
            setLastDoc(null);
        setReviews(aux);
    }

    const loadMore = () => {
        setPage(page + 1);
        if (lastDoc !== null && page + 1 === (reviews.length - 1) / 20)
            fetchReviews(false);
    }

    if (reviews !== null)

    return (
        <div id='reviews'>
            <h1>Recent Reviews</h1>
            <div className='content'>
                <div ref={scroll}></div>
                <div className='buttons'>
                    <p className={(page !== 0) ? 'on' : 'off'}>{'< '}<button disabled={(page !== 0) ? false : true} onClick={() => setPage(page-1)}>Prev</button></p>
                    <p className={(lastDoc !== null) ? 'on' : 'off'}><button disabled={(lastDoc !== null) ? false : true} onClick={loadMore}>Next</button>{' >'}</p>
                </div> 
                <div className='reviews'>                
                    {reviews.map(review => {
                        let index = reviews.indexOf(review);
                        if (index >= page * 20 && index < (page + 1) * 20)
                        return(
                            <div>
                                <div className='header'>
                                    <Link to={`/game/${review.gameId}/${review.gameName.replace(/\/| /g, '_')}`}>{review.gameName}</Link>
                                    { user ? <AddGameButton gameData={review} firestore={firestore} type={'review'} /> : ''}
                                    <p>(<Link to={`/game/${review.gameId}/${review.gameName.replace(/\/| /g, '_')}/reviews`}>All Reviews</Link>)</p>
                                </div>
                                <ReviewComponent review={review} />
                            </div>
                        )
                    })}                
                </div>
                <div className='buttons'>
                    <p className={(page !== 0) ? 'on' : 'off'}>{'< '}<button disabled={(page !== 0) ? false : true} onClick={() => setPage(page-1)}>Prev</button></p>
                    <p className={(lastDoc !== null) ? 'on' : 'off'}><button disabled={(lastDoc !== null) ? false : true} onClick={loadMore}>Next</button>{' >'}</p>
                </div> 
            </div> 
        </div>
    );

    else

    return (
        <div id='reviews'>
            <div className='content'>
                <p>Please wait...</p>
            </div>
        </div>
    )
};

export default Reviews;