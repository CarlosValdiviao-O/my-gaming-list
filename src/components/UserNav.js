import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';

const UserNav = (props) => {
    const { signOut } = props;
    const user = useContext(UserContext);
    
    return (
        <div>
            <button onClick={() => console.log(user)}>print</button>
            <p>{user.displayName}</p>
            <button onClick={signOut}>Sign out</button>
        </div>
    );
};

export default UserNav;