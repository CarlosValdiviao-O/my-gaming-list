import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const GamesByYear = () => {
    const user = useContext(UserContext);

    const { year } = useParams();
    
    return (
        <div>
            <h1>{`${year}'s Games`}</h1>
        </div>
    );
};

export default GamesByYear;