import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';
import UserNav from './UserNav';
import './Nav.css'
import 'firebase/compat/functions';

const Nav = (props) => {
    const { signIn, signOut, firebase } = props;
    const user = useContext(UserContext);
    const getRAWG = firebase.functions().httpsCallable('getRAWG');

    const searchPokemon = async () => {
        const link = 'https://api.rawg.io/api/games?search=pokemon&search_precise=true';
        const data = await getRAWG({ link: link });
        console.log(data);
        console.log(JSON.parse(data.data));
    }

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
                <div id='platforms'>
                    <button onClick={searchPokemon}>sd</button>
                </div>
                <div id='search-bar'>

                </div>
            </div>
        </nav>
    );
};

export default Nav;