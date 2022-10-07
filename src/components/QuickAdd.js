import { useEffect,  useState, useContext, useRef } from 'react';
import { UserContext } from './UserContext';
import { collection, addDoc, serverTimestamp, } from 'firebase/firestore';

const QuickAdd = (props) => {

    const { game, firestore, type, userDoc } = props;
    const [ text, setText ] = useState('Add');
    const [ status, setStatus ] = useState('Plan to Play');
    const [ score, setScore ] = useState(11);

    const classes = 'quick-add ' + type;
    
    const user = useContext(UserContext);

    const buttonRef = useRef();

    const hideRef = useRef();

    useEffect(() => {
        if(type === 'side hide') 
        setTimeout(() => {
            hideRef.current.style.height = 0;
        }, 250)        
        else
        hideRef.current.style.height = 'fit-content';   
    }, [type])
    
    useEffect(() => {
        if (user) {
            if (user.games.includes(game.id)) setText('Update');
            else setText('Add');
        }
    }, [user, userDoc]);

    useEffect(() => {
        if (userDoc !== null) {
            if (userDoc.exists) {
                setScore(userDoc.data().score);
                setStatus(userDoc.data().status);
            }
        }
    }, [userDoc])

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

    const saveGame = async () => {
        buttonRef.current.disabled = true;
        if (userDoc !== null) {
            await userDoc.ref.update({
                score: (score >= 1 && score <= 10) ? +score : null,
                status: status,
                timestamp: serverTimestamp(),
            })
            buttonRef.current.disabled = false;
        } 
        else
        try {
            await addDoc(collection(firestore, 'userGames'), {
                score: (score >= 1 && score <= 10) ? +score : null,
                status: status,
                timestamp: serverTimestamp(),
                gameName: game.name,
                gameId: game.id,
                gameImg: game.img,
                userId: user.id,
                platforms: game.platforms,
                genres: game.genres,
            });
            buttonRef.current.disabled = false;
        }
        
        catch (error) {
            console.error('Error writing new message to Firebase Database', error);
        }
    
    }   

    return (
        <div className={classes} ref={hideRef} >
            {(text === 'Update' && type !== 'center') ? <h4>Edit Status</h4> : ''}
            <div id='status'>
                <label>Status:</label>
                <select className={status.toLowerCase().replace(/ /g, '-')} onChange={(e) => setStatus(e.target.value)} value={status}>
                    {options.map(opt => {
                        return (
                            <option key={options.indexOf(opt)} value={opt}>{opt}</option>
                        )
                    })}
                </select>
            </div>
            <div id='rating'>
                <label>Your Score:</label>
                <select onChange={(e) => setScore(e.target.value)} value={score}>
                    <option key={11} value={11}>Select a score</option>
                    {scores.map(score => {
                        return (
                            <option key={scores.indexOf(score)} value={scores.indexOf(score) + 1}>{score}</option>
                        )
                    })}
                </select>
            </div>
            <div>
                <div></div>
                <button onClick={saveGame} ref={buttonRef} className={text.toLowerCase()}>{text}</button>
            </div>
        </div>
    )
};

export default QuickAdd;