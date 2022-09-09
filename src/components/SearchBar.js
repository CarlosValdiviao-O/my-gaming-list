import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'firebase/compat/functions';
import Icon from '../icons/search.svg';
import 'firebase/compat/firestore';
import useClickOutside from './useClickOutside';
import Image from '../icons/question-mark.png';
import Spinner from '../icons/spinner.gif'

const SearchBar = (props) => {
    const { firebase } = props;
    const [ pickedOp, setPickedOp ] = useState('all');
    const [ searchVal, setSearchVal ] = useState('');
    const [ searchResults, setSearchResults ] = useState('');
    const [ dispRes, setDispRes ] = useState(false);
    const [ searching, setSearching ] = useState(false);
    const [ lastSearch, setLastSearch ] = useState('');
    const getRAWG = firebase.functions().httpsCallable('getRAWG');
    const link = 'https://api.rawg.io/api/games?page_size=8&search=';
    const firestore = firebase.firestore();
    const options = [
        {name: 'All Games', val: 'all' },
        {name: 'PlayStation', val: '&platforms=187,18,16,15,27,17'},
        {name: 'Nintendo', val: '&platforms=7,8,9,13,83,10,11,105'},
        {name: 'Microsoft', val: '&platforms=1,186,14,80'},
        {name: 'PC', val: '&platforms=4'},
        {name: 'Users', val: 'user'},
    ];

    useEffect(() => {
        if(searchVal !== '')
        setDispRes(true);
        else
        setDispRes(false);
    }, [searchVal])

    const fetchSearch = async () => {
        if (searchVal == '') return;
        setSearchResults('');
        setSearching(true);
        setDispRes(true);
        setLastSearch(searchVal);
        if (pickedOp !== 'user') {
            let platform = (pickedOp === 'all') ? '' : pickedOp;
            let newLink = link + searchVal + '&search_precise=true' + platform;
            let fetchedItems = await getRAWG({ link: newLink});
            filterGamesData(JSON.parse(fetchedItems.data));
        }
        else {
            let usersRef = await firestore.collection('users').orderBy('keyword').limit(8).startAt(searchVal)
            .endAt(searchVal + '\uf8ff').get();
            let aux = [];
            usersRef.docs.forEach((doc) => {
                aux.push(doc.data());
            })
            filterUserData(aux);
        }
        setSearching(false);
    }

    const filterGamesData = (data) => {
        let aux = [];
        let count = (data.count > 8) ? 8 : data.count;
        for (let i = 0; i < count; i++) {
            let platforms = '';
            let genres = '';
            for ( let j = 0; j < 5; j++) {
                if (data.results[i].platforms !== null)
                if (data.results[i].platforms[j]) platforms += data.results[i].platforms[j].platform.name + ', ';
                if (data.results[i].genres[j]) genres += data.results[i].genres[j].name + ', ';
            }
            
            aux[i] = {
                name: data.results[i].name,
                pic: data.results[i].background_image,
                platforms: platforms.slice(0, platforms.length - 2),
                releaseDate: (data.results[i].tba === false) ? new Date(data.results[i].released).getFullYear() : 'TBA',
                genres: (genres !== '') ? genres.slice(0, genres.length - 2) : '',
                game: true,
                link: '/game/' + data.results[i].id,
            }
        }
        setSearchResults(aux);
    }

    const filterUserData = (data) => {
        let aux = [];
        aux = data.map(item => {
            return( {
                name: item.name, 
                pic: item.pic,
                game: false,
                link: '/profile/' + item.id,
            })  
        });
        setSearchResults(aux);
    }

    const divRef = useClickOutside(() => {
        setDispRes(false);
    })
    
    return (
        <div id='search-bar'>
            <select onChange={(e) => setPickedOp(e.target.value)} id='search-options'>
                {options.map(opt => {
                    return(
                        <option value={opt.val} key={options.indexOf(opt)}>{opt.name}</option>
                    )
                })}
            </select>
            <div id='search-container'>
                <input onFocus={() => setDispRes(true)} onChange={(e) => setSearchVal(e.target.value)} 
                    placeholder='Search Games...'></input>
                <div ref={divRef} id='search-results' className={(dispRes === true) ? '' : 'hide'}>
                    {(dispRes === true && searchResults !== '') ? 
                        searchResults.map(item => {
                        return(
                            <Link onClick={() => setDispRes(false)} key={searchResults.indexOf(item)} to={item.link}>
                                <div className='search-result'>
                                    <div className='image-container'>
                                        <img src={(item.pic) ? item.pic : Image} alt={item.name}></img>
                                    </div>
                                    {(item.game === true) ? 
                                    <div className='result-info'>
                                        <div className='title-date'>
                                            <p className='title'>{item.name}</p>
                                            <p className='date'>{`(${item.releaseDate})`}</p>
                                        </div>
                                        <p className='hide'>{`Platforms: ${item.platforms}`}</p>
                                        <p className='hide'>{(item.genres !== '') ? `Genres: ${item.genres}` : ''}</p>
                                    </div>
                                    :
                                    <div className='result-info'>
                                        <p className='title'>{item.name}</p>
                                    </div>}
                                </div>
                            </Link>
                        )
                    }) : ''}
                    <div id='results-footer'>
                        {(searching === true) ? 
                        <div>
                            <p>{`Searching for: `}<span>{lastSearch}</span></p>
                            <img src={Spinner}></img>
                        </div>
                        : 
                        (searchResults !== '') ? 
                        <div id='footer-message'>
                            {(!searchResults[0]) ? <p>{`No results found for: `}<span>{lastSearch}</span></p>
                            : <Link to={`/search/${pickedOp}/${lastSearch}`}>
                                <p>{`See more results for: `}<span>{lastSearch}</span></p>
                              </Link>}
                        </div>
                        : '' 
                        }

                    </div>
                </div>
            </div>
            <button onClick={fetchSearch}>
                <img src={Icon} alt='search-icon'></img>
            </button>
        </div>
    );
};

export default SearchBar;