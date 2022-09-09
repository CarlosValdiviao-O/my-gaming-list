import { Link } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import { getFirestore, getDoc, doc } from 'firebase/firestore';
import List from './../icons/format-list-bulleted.svg';
import ListLight from './../icons/format-list-bulleted-light.svg';
import Arrow from './../icons/menu-down.svg';
import useClickOutside from './useClickOutside';

const UserNav = (props) => {
    const { signOut } = props;
    const user = useContext(UserContext);
    const [ listsDisp, setListsDisp ] = useState(false);
    const [ lists, setLists ] = useState([]);
    const [ optionsDisp, setOptionsDisp ] = useState(false);
    const [ listIcon, setListIcon ] = useState(List);

    useEffect(() => {
        if (user) {
            setLists(user.lists);
        }
    }, [user]);

    let userListRef = useClickOutside(() => {
        setListsDisp(false);
    });

    let userOptionsRef = useClickOutside(() => {
        setOptionsDisp(false);
    })
    
    return (
        <div id='user-nav'>
            <div ref={userListRef} id='user-lists-button' onClick={() => setListsDisp((listsDisp) => !listsDisp)} >
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
            <div ref={userOptionsRef} id='user-options-button' onClick={() => setOptionsDisp((optionsDisp) => !optionsDisp)}>
                <button> 
                    <p>{user.name}</p>
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
            <img id='nav-profile-pic' src={user.pic} alt={user.name + ' Pic'} referrerPolicy="no-referrer"></img>
        </div>
    );
};

export default UserNav;