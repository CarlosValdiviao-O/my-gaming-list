import { Link } from 'react-router-dom';
import { useEffect, useRef, useState, useContext } from 'react';
import { UserContext } from './../components/UserContext';
import { getFirestore, collection, getDocs, addDoc,
     serverTimestamp, where, update } from 'firebase/firestore';

const AddGameButton = (props) => {

    const { gameData, firestore, type } = props;
    
    const user = useContext(UserContext);

    const [ text, setText ] = useState('add');
    const [ showModal, setShowModal ] = useState(false);
    const [ status, setStatus ] = useState('Plan to Play');
    const [ score, setScore ] = useState(null);
    const [ data, setData ] = useState(null);

    useEffect(() => {
        if (type === 'review') formatReview();
        if (type === 'game') formatGame();
    }, [gameData])

    useEffect(() => {
        if (user && data) {
            if (user.games.includes(data.gameId)) setText('edit');
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
            familyGames: gameData.familyGames,
            releaseDate: gameData.releaseDate,
            gameDescription: gameData.gameDescription,
        })
    }

    const formatGame = () => {
        setData({
            gameName: gameData.name,
            gameId: gameData.id,
            gameImg: gameData.mg,
            platforms: gameData.platforms,
            genres: gameData.genres,
            familyGames: gameData.familyGames,
            releaseDate: gameData.releaseDate,
            gameDescription: gameData.description,
        })
    }

    const saveGame = async () => {
        const gameRef = firestore.collection('userGames').where('gameId', '==', gameData.gameId).where('userId', '==', user.id);
        const docSnapshot = await gameRef.get()
        let exists = false;
        docSnapshot.forEach(doc => {
            exists = true;
            if (doc.exists) {
                doc.ref.update({
                    score: +score,
                    status: status,
                })
            } 
        })   
        if (exists === false) {
            try {
                await addDoc(collection(firestore, 'userGames'), {
                    score: +score,
                    status: status,
                    timestamp: serverTimestamp(),
                    gameName: data.gameName,
                    gameId: data.gameId,
                    gameImg: data.gameImg,
                    userId: user.id,
                    platforms: data.platforms,
                    genres: data.genres,
                    familyGames: data.familyGames,
                    releaseDate: data.releaseDate,
                    gameDescription: data.gameDescription,
                });
            }
            
            catch (error) {
                console.error('Error writing new message to Firebase Database', error);
            }
        }
        setShowModal(false);
    }  
    
    const removeGame = async () => {
        const gameRef = firestore.collection('userGames').where('gameId', '==', gameData.gameId).where('userId', '==', user.id);
        const docSnapshot = await gameRef.get()
        docSnapshot.forEach(doc => {
            doc.ref.delete();           
        })
        setShowModal(false);
        setText('add');
    }    

    const toggleModal = async () => {
        setShowModal(true);
        if (text === 'edit') {
            const gameRef = firestore.collection('userGames').where('gameId', '==', gameData.gameId).where('userId', '==', user.id);
            const docSnapshot = await gameRef.get()
            docSnapshot.forEach(doc => {
                setScore(doc.data().score);
                setStatus(doc.data().status);          
            })
        }
    }

    if (showModal === false)
    return (
        <button onClick={toggleModal}>
            {text}
        </button>
    );

    else
    return (
        <div id='modal'>
            <h3>Add Game to my List</h3>
            <form>
                <div id='title'>
                    <p>Game Title</p>
                    <Link to={`/game/${gameData.gameId}`}>{gameData.gameName}</Link>
                </div>
                <div id='status'>
                    <label>Status</label>
                    <select onChange={(e) => setStatus(e.target.value)} defaultValue={status}>
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
                        <option key={11} value={null}>Select a score</option>
                        {scores.map(score => {
                            return (
                                <option key={scores.indexOf(score)} value={scores.indexOf(score) + 1}>{score}</option>
                            )
                        })}
                    </select>
                </div>
            </form>
            <div id='buttons'>
                <button onClick={saveGame}>submit</button>
                {(text === 'edit') ? <button onClick={removeGame}>remove</button> : ''}
            </div>
        </div>
    )
};

export default AddGameButton;