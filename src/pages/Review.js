import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const Review = () => {
    const user = useContext(UserContext);

    const { id } = useParams();
    
    return (
        <div>
            <h1>{`Id: ${id}`}</h1>
        </div>
    );
};

export default Review;