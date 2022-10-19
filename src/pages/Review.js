import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './../components/UserContext';
import ReviewComponent from '../components/ReviewComponent';
import { Timestamp } from 'firebase/firestore';
import '../components/Review.css';
import useClickOutside from '../components/useClickOutside';
import AddGameButton from '../components/AddGameButton';

const Review = (props) => {
    const user = useContext(UserContext);

    const { editor, firestore } = props;

    const { id, gameId, game } = useParams();

    const [ reviewDoc, setReviewDoc ] = useState(null);
    const [ reviewText, setReviewText ] = useState('');
    const [ recommended, setRecommended ] = useState('Recommended');
    const [ rating, setRating ] = useState(5);
    const [ showPreview, setShowPreview ] = useState(false);
    const [ review, setReview ] = useState({
        ['review']: reviewText,
        ['recommended']: recommended,
        ['rating']: rating,
        createdAt: Timestamp.now(),
        gameId: '',
        gameName: '',
        id: id,
        userId: '',
        userImg: '',
        userName: '', 
    });
    const [ showDelete, setShowDelete ] = useState(false);
    const [ afterMessage, setAfterMessage ] = useState('');
    const [ showWarning, setShowWarning ] = useState(false);

    useEffect(() => {
        if (user && reviewDoc) {
            setReview({
                ['review']: reviewText,
                ['recommended']: recommended,
                ['rating']: rating,
                createdAt: Timestamp.now(),
                gameId: gameId || reviewDoc.data().gameId,
                gameName: (game) ? game.replace(/_/g, ' ') : reviewDoc.data().gameName,
                id: id,
                userId: user.id,
                userImg: user.pic,
                userName: user.name, 
            })
        }
    }, [reviewText, rating, recommended, user, reviewDoc])

    const scores = [
        'Appalling',
        'Horrible',
        'Very Bad',
        'Bad',
        'Average',
        'Fine',
        'Good',
        'Very Good',
        'Great',
        'Masterpiece',
    ]

    useEffect(() => {
        const fetchReview = async () => {
            const reviewRef = firestore.collection('reviews').doc(id);
            const docSnapshot = await reviewRef.get();
            setReviewDoc(docSnapshot);                        
        } 
        fetchReview();
    }, [id])

    useEffect(() => {
        if (reviewDoc !== null) {
            if (reviewDoc.exists) {
                const data = reviewDoc.data();
                setReviewText(data.review);
                setRecommended(data.recommended);
                setRating(data.rating);
                setShowDelete(true);
            }
        }
    }, [reviewDoc])

    const saveReview = async () => {
        if (reviewText.length < 1500) {
            setShowWarning(true);
            return;
        }
        buttonRef.current.disabled = true;
        if (reviewDoc !== null && reviewDoc.exists) {
            try {
                await reviewDoc.ref.update({
                    review: reviewText,
                    rating: rating,
                    recommended: recommended,
                })
                setAfterMessage('Successfuly updated your review');
            }
            catch (error) {
                setAfterMessage('Something went wrong, please try again later');
                console.error('Error writing new message to Firebase Database', error);
            }
            buttonRef.current.disabled = false;
        } 
        else {
            try {
                await reviewDoc.ref.set(review);
                setAfterMessage('Successfuly created your review');
            }        
            catch (error) {
                setAfterMessage('Something went wrong, please try again later');
                console.error('Error writing new message to Firebase Database', error);
            }
            buttonRef.current.disabled = false;
        }
    } 

    const showAlert = () => {
        if (window.confirm('Are you sure you want to delete this review?') === true) {
          reviewDoc.ref.delete()
          .then(() => {
            setAfterMessage('Successfuly deleted your review');
          }).catch(() => {
            setAfterMessage('Something went wrong, please try again later');
          })
        } 
    }

    const buttonRef = useRef();

    let previewDiv = useClickOutside(() => {
        setShowPreview(false);
    })

    return (
        <div id='review'>
            <h1>Review</h1>
            {(afterMessage !== '') ?
            <div className={(afterMessage.includes('wrong')) ? 'after-message trouble' : 'after-message success'}>
                <p>{afterMessage}</p>
            </div>
            : ''}
            {(editor === true) ? 
            <div className='editor'>
                <div className='left'>
                    <h4>{game.replace(/_/g, ' ')}</h4>
                    <div className={(showWarning === true) ? 'warning' : 'warning hide'}>
                        <h4><span>⚠</span> This review needs more information!</h4>
                        <p>Here are a few subjects you may want to expand upon:</p>
                        <ul>
                            <li>Gameplay. What did you think about the game's mechanics?</li>
                            <li>Controls. Were the controls annoying or intuitive?</li>
                            <li>Visuals/Sound. Did you find yourself immersed in the game's atmosphere?</li>
                            <li>Reception. Do you think others will enjoy/dislike this series?</li>
                            <li>Overall Enjoyment. What was your personal experience with this game?</li>
                        </ul>
                    </div>
                    <div className='text'>
                        <h4>Review Text</h4>
                        <textarea onChange={(e) => setReviewText(e.target.value)} value={reviewText}></textarea>
                    </div>
                    <div className='rating'>
                        <h4>Overall Rating</h4>
                        <div className='scores'>
                            {scores.map(score => {
                                let index = scores.indexOf(score);
                                return(
                                    <button className={(index + 1 === rating) ? 'current box' : 'box'} key={index} onClick={() => setRating(index + 1)}>{index + 1}</button>
                                )
                            })}
                            <p>{`${rating} - ${scores[rating - 1]}`}</p>
                        </div>
                    </div>                
                </div>
                <div className='right'>
                    <div className='buttons'>
                        <button className='preview-button' onClick={() => setShowPreview(!showPreview)}>Preview</button>
                        <button ref={buttonRef} className='publish' onClick={saveReview}><span>🤖</span> Publish</button>
                    </div>
                    <div className='recommend-options'>
                        <h4>Would you recommend this?</h4>
                        <div className='options' onChange={(e) => setRecommended(e.target.value)}>
                            <div className={(recommended === 'Recommended') ? 'option checked' : 'option'}>
                                <input type={'radio'} value={'Recommended'} name={'recommended'} id='op1'></input>
                                <label htmlFor='op1'>Recommended</label>
                            </div>
                            <p>Review readers should definitely play this!</p>
                            <div className={(recommended === 'Mixed Feelings') ? 'option checked' : 'option'}>
                                <input type={'radio'} value={'Mixed Feelings'} name={'recommended'} id='op2'></input>
                                <label htmlFor='op2'>Mixed Feelings</label>
                            </div>
                            <p>Not sure. Some review readers will like this, but others will not enjoy it.</p>
                            <div className={(recommended === 'Not Recommended') ? 'option checked' : 'option'}>
                                <input type={'radio'} value={'Not Recommended'} name={'recommended'} id='op3'></input>
                                <label htmlFor='op3'>Not Recommended</label>
                            </div>
                            <p>Most review readers will not like this.</p>
                        </div>
                    </div>
                    {(showDelete === true) ? 
                    <div className='delete-options'>
                        <h4>Delete</h4>
                        <button onClick={showAlert}>Delete</button>
                        <p>Deleted reviews cannot be recovered</p>
                    </div>
                    : ''}
                </div>
                <div className={(showPreview === true) ? 'preview' : 'preview hide'}>
                    <div ref={previewDiv} className='container'>
                        <div className='preview-box'>
                            <div className='header'>
                                <p>This is how your review will appear in the game page</p>
                                <button className='close' onClick={() => setShowPreview(false)}>x</button>
                            </div>
                            <ReviewComponent review={review} showAll={true} />
                        </div>
                    </div>
                </div>
            </div>
            :
            <div>
                {(reviewDoc !== null && reviewDoc.exists) ?
                <div className='view-only'>
                    <div className='header'>
                        <Link to={`/game/${reviewDoc.data().gameId}/${reviewDoc.data().gameName.replace(/\/| /g, '_')}`}>{reviewDoc.data().gameName}</Link>
                        { user ? <AddGameButton gameData={reviewDoc.data()} firestore={firestore} type={'review'} /> : ''}
                        <p>(<Link to={`/game/${reviewDoc.data().gameId}/${reviewDoc.data().gameName.replace(/\/| /g, '_')}/reviews`}>All Reviews</Link>)</p>
                    </div>
                    <ReviewComponent review={reviewDoc.data()} showAll={true} />
                </div>
                : ''}
            </div>}
        </div>
    );
};

export default Review;
