import { useEffect, useState } from 'react';
import ReviewComponent from '../components/ReviewComponent';
import '../components/Reviews.css'

const Reviews = (props) => {
    const { firestore } = props;
    const [ reviews, setReviews ] = useState(null);
    const [ lastDoc,  setLastDoc ] = useState(null);
    const [ page, setPage ] = useState(0);
    
    useEffect(() => {
       fetchReviews(true) 
    }, []);

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
                <div className='buttons'>
                    <p className={(page !== 0) ? 'on' : 'off'}>{'< '}<button disabled={(page !== 0) ? false : true} onClick={() => setPage(page-1)}>Prev</button></p>
                    <p className={(lastDoc !== null) ? 'on' : 'off'}><button disabled={(lastDoc !== null) ? false : true} onClick={loadMore}>Next</button>{' >'}</p>
                </div> 
                <div className='reviews'>                
                    {reviews.map(review => {
                        let index = reviews.indexOf(review);
                        if (index >= page * 20 && index < (page + 1) * 20)
                        return(
                            <ReviewComponent review={review} />
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
        <p>Please wait...</p>
    )
};

export default Reviews;