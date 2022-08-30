import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const TopGames = () => {
    const user = useContext(UserContext);

    const { platform } = useParams();
    
    return (
        <div>
            <h1>{`Top ${platform} Games`}</h1>
        </div>
    );
};

export default TopGames;