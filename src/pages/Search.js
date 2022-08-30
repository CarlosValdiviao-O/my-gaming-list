import { Link, useParams } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './../components/UserContext';

//to search for the next 20 evaluate count and add &page=num to link

const Search = () => {
    const user = useContext(UserContext);

    const { platform, text } = useParams();
    console.log(platform + text);
    
    return (
        <div>
            <h1>{`Search Games ${platform} ${text}`}</h1>
        </div>
    );
};

export default Search;