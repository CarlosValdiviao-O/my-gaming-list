import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const UserList = () => {
    const user = useContext(UserContext);

    const { id, list } = useParams();
    console.log(id);
    return (
        <div>
            <h1>{list + ' List'}</h1>
        </div>
    );
};

export default UserList;

//'x-box-series-x-s'.replace(/(?:^\w|[A-Z]|\b\w|\s+|\/)/g, function(match, index) {
//    return  match.toUpperCase();
//}).replace(/X-S/g, 'X/S').replace(/-/g, ' ')