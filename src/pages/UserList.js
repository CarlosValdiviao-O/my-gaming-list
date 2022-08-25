import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const UserList = () => {
    const user = useContext(UserContext);

    const { id, list } = useParams();
    
    return (
        <div>
            <h1>{list + ' List'}</h1>
        </div>
    );
};

export default UserList;