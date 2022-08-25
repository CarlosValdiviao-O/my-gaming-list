import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { getFirestore, collection, getDocs, getDoc, doc } from 'firebase/firestore';
import List from './../icons/format-list-bulleted.svg';
import ListLight from './../icons/format-list-bulleted-light.svg';
import Arrow from './../icons/menu-down.svg';

const UserNav = (props) => {
    const { signOut } = props;
    const user = useContext(UserContext);
    const [ listsDisp, setListsDisp ] = useState(false);
    const [ lists, setLists ] = useState([]);
    const [ optionsDisp, setOptionsDisp ] = useState(false);
    const [ listIcon, setListIcon ] = useState(List);

    useEffect(() => {
        if (user) {
            let data = getLists();
            Promise.resolve(data).then((val) => setLists(val.lists))
        }
    }, [user]);

    const firestore = getFirestore();

    function toggleUserLists () {
        (listsDisp === true) ? setListsDisp(false) : setListsDisp(true);
    }

    function toggleUserOptions () {
        (optionsDisp === true) ? setOptionsDisp(false) : setOptionsDisp(true);
    }

    async function getLists() {
        const docRef = doc(firestore, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        return data;
    }
    
    return (
        <div id='user-nav'>
            <div id='user-lists-button' onClick={toggleUserLists} >
                <img src={listIcon} alt='list-icon' id='list-icon'
                    onMouseEnter={() => setListIcon(ListLight)} onMouseLeave={() => setListIcon(List)}></img>               
                {(listsDisp === true) ?
                <div id='user-lists'>
                   { lists.map((list) => {
                        return (
                            <Link key={lists.indexOf(list)} to={`/${list}/${user.uid}`}>
                                <button >{list + ' List'}</button>
                            </Link>
                        )
                    })}
                 </div>
                : ''}
            </div>
            <div id='user-options-button' onClick={toggleUserOptions}>
                <button> 
                    <p>{user.displayName}</p>
                    <img src={Arrow} alt='arrow-icon' id='arrow-icon'></img>
                </button>
                
                {optionsDisp === true ? 
                 <div id='user-options'>
                        <Link to={`/profile/${user.uid}`}>
                            <button>Profile</button>
                        </Link>
                        <Link to={`/reviews/${user.uid}`}>
                            <button>Reviews</button>
                        </Link>
                        <Link to={`/`}>
                            <button onClick={signOut}>Sign out</button>
                        </Link>
                    </div>
                : ''}
            </div>
            <img id='nav-profile-pic' src={user.photoURL} alt={user.displayName + ' Pic'} referrerPolicy="no-referrer"></img>
        </div>
    );
};

export default UserNav;