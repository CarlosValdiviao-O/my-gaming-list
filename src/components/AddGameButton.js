import { Link } from 'react-router-dom';
import { useEffect,  useState, useContext } from 'react';
import { UserContext } from './../components/UserContext';
import { collection, addDoc, serverTimestamp, } from 'firebase/firestore';
import './AddGameButton.css';

const AddGameButton = (props) => {

    const { gameData, firestore, type } = props;
    
    const user = useContext(UserContext);

    const [ text, setText ] = useState('add');
    const [ showModal, setShowModal ] = useState(false);
    const [ status, setStatus ] = useState('Plan to Play');
    const [ score, setScore ] = useState(11);
    const [ data, setData ] = useState(null);
    const [ topCoord, setTopCoord ] = useState(0);
    const [ resultMessage, setResultMessage ] = useState('Wait please...');
    const [ showResult, setShowResult ] = useState(false);

    useEffect(() => {
        if (type === 'review') formatReview();
        if (type === 'game') formatGame();
    }, [gameData])

    useEffect(() => {
        if (user && data) {
            if (user.games.includes(data.gameId)) setText('edit');
            else setText('add');
        }
    }, [user, data])

    const options = [
        'Playing',
        'Completed',
        'On-Hold',
        'Dropped',
        'Plan to Play',
    ]

    const scores = [
        '(1) Appalling',
        '(2) Horrible',
        '(3) Very Bad',
        '(4) Bad',
        '(5) Average',
        '(6) Fine',
        '(7) Good',
        '(8) Very Good',
        '(9) Great',
        '(10) Masterpiece',
    ]

    const formatReview = () => {
        setData({
            gameName: gameData.gameName,
            gameId: gameData.gameId,
            gameImg: gameData.gameImg,
            platforms: gameData.platforms,
            genres: gameData.genres,
        })
    }

    const formatGame = () => {
        setData({
            gameName: gameData.name,
            gameId: gameData.id,
            gameImg: gameData.img,
            platforms: gameData.platforms,
            genres: gameData.genres,
        })
    }

    const saveGame = async () => {
        setShowResult(true);
        const gameRef = firestore.collection('userGames').where('gameId', '==', data.gameId).where('userId', '==', user.id);
        const docSnapshot = await gameRef.get()
        let exists = false;
        await docSnapshot.forEach(doc => {
            exists = true;
            if (doc.exists) {
                doc.ref.update({
                    score: (score >= 1 && score <= 10) ? +score : null,
                    status: status,
                    timestamp: serverTimestamp(),
                })
                setResultMessage('Succesfuly updated entry.');
            } 
        })   
        if (exists === false) {
            try {
                await addDoc(collection(firestore, 'userGames'), {
                    score: (score >= 1 && score <= 10) ? +score : null,
                    status: status,
                    timestamp: serverTimestamp(),
                    gameName: data.gameName,
                    gameId: data.gameId,
                    gameImg: data.gameImg,
                    userId: user.id,
                    platforms: data.platforms,
                    genres: data.genres,
                });
                setResultMessage('Succesfuly added entry.');
            }
            
            catch (error) {
                console.error('Error writing new message to Firebase Database', error);
            }
        }
    }  
    
    const removeGame = async () => {
        setShowResult(true);
        const gameRef = firestore.collection('userGames').where('gameId', '==', data.gameId).where('userId', '==', user.id);
        const docSnapshot = await gameRef.get()
        await docSnapshot.forEach(doc => {
            doc.ref.delete();           
        })
        setResultMessage('Succesfuly removed entry.')
        setText('add');
        setScore(11);
    }    

    const toggleModalOn = async () => {
        setTopCoord(window.scrollY + 80);
        setResultMessage('Wait please...');
        setShowResult(false);
        setShowModal(true);
        if (text === 'edit') {
            const gameRef = firestore.collection('userGames').where('gameId', '==', data.gameId).where('userId', '==', user.id);
            const docSnapshot = await gameRef.get()
            docSnapshot.forEach(doc => {
                setScore(doc.data().score);
                setStatus(doc.data().status);          
            })
        }
    }

    const closeModal = () => {
        setShowModal(false);
        setResultMessage('Wait please...');
        setStatus('Plan to Play');
        setScore(11);
    }

    if (showModal === false)
    return (
        <button className={'button-modal ' + text} onClick={toggleModalOn}>
            {text}
        </button>
    );

    else
    return (
        <div id='modal'>
            <div className='background' onClick={closeModal}></div>
            <div className='box' style={{top: topCoord}}>
                <button className='close' onClick={closeModal}>x</button>
                {(showResult === false) ?
                <div className='border'>
                    <div className='inner-box'>
                        <h3>{(text === 'add') ? 'Add Game to my List' : 'Edit Game'}</h3>
                        <form>
                            <div id='title'>
                                <p>Game Title</p>
                                <Link to={`/game/${data.gameId}/${data.gameName.replace(/\/| /g, '_')}`}>{data.gameName}</Link>
                            </div>
                            <div id='status'>
                                <label>Status</label>
                                <select onChange={(e) => setStatus(e.target.value)} value={status}>
                                    {options.map(opt => {
                                        return (
                                            <option key={options.indexOf(opt)} value={opt}>{opt}</option>
                                        )
                                    })}
                                </select>
                            </div>
                            <div id='rating'>
                                <label>Your Score</label>
                                <select onChange={(e) => setScore(e.target.value)} value={score}>
                                    <option key={11} value={11}>Select a score</option>
                                    {scores.map(score => {
                                        return (
                                            <option key={scores.indexOf(score)} value={scores.indexOf(score) + 1}>{score}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </form>
                        <div id='buttons'>
                            <button className='input-button' onClick={saveGame}>Submit</button>
                            {(text === 'edit') ? <button className='input-button' onClick={removeGame}>Remove</button> : ''}
                        </div>
                    </div>
                </div>
                :
                <div className='resultBox'>
                    <p>{resultMessage}</p>
                    <div className='links'>
                        <Link to={`/list/all-games/${user.id}/${user.name.replace(/\/| /g, '_')}`}>View my Games List</Link>
                        <p>-</p>
                        <Link to={`/game/${data.gameId}/${data.gameName.replace(/\/| /g, '_')}`}>Go to Game Page</Link>
                    </div>
                </div>}
            </div>
        </div>
    )
};

export default AddGameButton;