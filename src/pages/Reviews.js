import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const Reviews = () => {
    const user = useContext(UserContext);
    
    return (
        <div>
            <h1>{user.displayName + 'Reviews'}</h1>
        </div>
    );
};

export default Reviews;