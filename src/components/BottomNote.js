import { Link } from 'react-router-dom';
import { useEffect,  useState } from 'react';

const BottomNote = (props) => {

    const [ showMessage, setShowMessage ] = useState(false);
    
    return (
        <div className='section bottom-note'>
            <p>Seeing to few games<button onClick={() => setShowMessage(!showMessage)}>?</button></p>
            <p className={(showMessage === false) ? 'hide' : ''}>This page only shows games that have had at least 1 member or have been amongst the 20's highest rated games for their release year according to metacritic, if the game that you are looking for doesn't appear here you can look for it on the search-bar, or heading to the <Link to={'/search'}>search page</Link></p>
        </div>
    )
};

export default BottomNote;