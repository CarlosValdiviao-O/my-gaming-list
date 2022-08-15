import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import UserNav from './UserNav';
import './Nav.css'

const Nav = (props) => {
    const { signIn, signOut } = props;
    const user = useContext(UserContext);
    
    return (
        <nav>
            <div id='nav-top'>
                <Link id='logo' to={'/my-gaming-list'}>
                    <h1>MyGamingList</h1>
                </Link>
                { user ? 
                <UserNav signOut={signOut}></UserNav>
                : 
                <button id='sign-in' onClick={signIn}>Sign/Log In</button>}
            </div>
            <div id='nav-bottom'></div>
        </nav>
    );
};

export default Nav;