import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const Profile = () => {
    const user = useContext(UserContext);
    
    return (
        <div>
            <h1>{'Hello ' + user.displayName}</h1>
        </div>
    );
};

export default Profile;