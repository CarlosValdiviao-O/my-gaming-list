import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import UserNav from './UserNav';
import './Nav.css';
import Platforms from './Platforms';
import SearchBar from './SearchBar';

const Nav = (props) => {
    const { signIn, signOut, firebase } = props;
    const user = useContext(UserContext);
    return (
        <nav>
            <div id='nav-top'>
                <Link id='logo' to={'/'}>
                    <h1>MyGamingList</h1>
                </Link>
                { user ? 
                <UserNav signOut={signOut}></UserNav>
                : 
                <button id='sign-in' onClick={signIn}>Sign/Log In</button>}
            </div>
            <div id='nav-bottom'>
                <Platforms />
                <SearchBar firebase={firebase}/>
            </div>
        </nav>
    );
};

export default Nav;