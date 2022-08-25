import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

const Home = () => {
    const user = useContext(UserContext);
    
    return (
        <div>
            <h1>Home Page</h1>
        </div>
    );
};

export default Home;