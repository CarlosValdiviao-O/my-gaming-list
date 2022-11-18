import { Link, useParams } from 'react-router-dom';
import { useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from './../components/UserContext';
import Icon from '../icons/search.svg';
import GamesCarousel from '../components/GamesCarousel';
import genresData from '../components/genresData';
import GameCard from '../components/GameCard';
import '../components/Search.css';
import Image from '../icons/search-white.svg';

const Search = (props) => {
    const { firebase } = props;
    const user = useContext(UserContext);
    const [ header, setHeader ] = useState('Games Search');
    const [ page, setPage ] = useState(0);
    const [ viewedPages, setViewedPages ] = useState([]);
    const [ searchVal, setSearchVal ] = useState('');
    const [ games, setGames ] = useState(null);
    const [ users, setUsers ] = useState(null);
    const [ count, setCount ] = useState(null);
    const [ buttons, setButtons ] = useState(null);
    const firestore = firebase.firestore();
    const [ lastDoc, setLastDoc ] = useState('');
    const [ suggestions, setSuggestions ] = useState(null);
    const getRAWG = firebase.functions().httpsCallable('getRAWG');

    const { platform, text } = useParams();

    const letters = [
        'A', 'B', 'C', 'D', 'E', 'F', 'G',
        'H', 'I', 'J', 'K', 'L', 'M', 'N',
        'O', 'P', 'Q', 'R', 'S', 'T', 'U',
        'V', 'W', 'X', 'Y', 'Z'
    ];
    const platforms = [
        {name: 'PlayStation', val: '&platforms=187,18,16,15,27,17'},
        {name: 'Nintendo', val: '&platforms=7,8,9,13,83,10,11,105'},
        {name: 'Microsoft', val: '&platforms=1,186,14,80'},
        {name: 'PC', val: '&platforms=4'},
    ]
    
    let today = new Date();
    let year = today.getFullYear();
    let years = [];
    for (let i = 11; i >= 0; i--) {
        years.push(year - i);
    }

    const scroll = useRef();
    
    useEffect(() => {
        if (platform === 'genre')
            setHeader(`${text.replace(/_/g, ' ')} Games`);
        else if (platform === 'all')
            setHeader('Search All');
        else if (platform !== undefined && platform !== 'games') {
            platforms.forEach(item => {
                if (item.val === platform)
                    setHeader(`${item.name} Search`);
            })
        }
        else 
            setHeader('Games Search')
    }, [platform, text])

    useEffect(() => {
        if (platform !== undefined) {
            setPage(0);
            setGames(null);
            setUsers(null);
            setCount(null);
            setViewedPages([]);
            setButtons(null);
            setLastDoc('');
        }
        else    
            fetchSuggestions();
    }, [platform, text]);

    useEffect(() => {
        if (page === 0 && games === null && users === null) 
            fetchItems(0);
    }, [page, games, users])

    useEffect(() => {
        let aux = []
        for (let i = 0; i < count / 40; i++) {
            if ((i * 40) + 40 < count)
                aux.push(`${(i * 40) + 1} - ${(i * 40) + 40}`);
            else
                aux.push(`${(i * 40) + 1} - ${count}`);
        }
        setButtons(aux);
    }, [count])

    useEffect(() => {
        setTimeout(() => {
            scroll.current.scrollIntoView({behavior: 'smooth'})
        }, 2000)
    }, [games, users, page])

    const redirect = () => {
        if (searchVal !== '')
            window.location.href = `http://my-gaming-list.web.app/search/all/${searchVal}`;
        else
            window.location.href = `http://my-gaming-list.web.app/search`
    }

    const fetchItems = async (pageNum) => {
        let link = 'https://api.rawg.io/api/games?page_size=40';
        if (platform === 'genre') {
            let genre;
            genresData.map(item => {
            if (item.name.replace(/ /g, '_') === text)
                genre = item.slug
            })
            link += `&genres=${genre}`; 
        }
        else {
            if (platform !== 'all' && platform !== 'games')
                link += '&search=' + text + platform;
            else
                link += '&search=' + text;
        }
        if (platform !== 'user') {
            let fetchedData = await getRAWG({link: link + `&ordering=-metacritic&page=${pageNum + 1}`});
            let fetchedItems = JSON.parse(fetchedData.data);
            let aux = [];
            if (games !== null)
                aux = games;
            fetchedItems.results.forEach(game => {
                let formatted = formatGame(game);
                formatted.page = pageNum;
                aux.push(formatted);
            })
            setGames(aux);
            if (count === null)
                setCount(fetchedItems.count);
        }
        if (platform === 'user' || platform === 'all') {
            let usersRef = await firestore.collection('users').where('keyword', '>=', text.toLowerCase())
                .where('keyword', '<=', text.toLowerCase() + '\uf8ff').orderBy('keyword').startAfter(lastDoc).limit(21).get();
            let aux = [];
            if (users !== null)
                aux = users;
            usersRef.docs.forEach((doc) => {
                let item = doc.data();
                item.page = pageNum;
                aux.push(item);
            })
            if (usersRef.docs.length === 21) {
                aux.pop();
                setLastDoc(usersRef.docs[usersRef.docs.length-2]);
            }
            else
                setLastDoc(null);
            setUsers(aux);
        }
        setViewedPages(state => ([...state, pageNum]));
    }

    const formatGame = (game) => {
        let date = (game.tba === false) ? game.released : 'TBA';
        let genres = [];
        if (game.genres !==  null && game.genres !== undefined)
            game.genres.forEach(genre => {
                genres.push(genre.name);
            })
        let platforms = [];
        if (game.platforms !==  null && game.platforms !== undefined)
            game.platforms.forEach(plat => {
                platforms.push(plat.platform.name);
            })
        let formatted = {
            id: `${game.id}`,
            name: game.name,
            releaseDate: date,
            genres: genres,
            img: game.background_image,
            description: '',
            platforms: platforms,
            visibleScore: '?',
            visibleMembers: '?',
        }
        return formatted;
    }

    const fetchSuggestions = async () => {
        let link = 'https://api.rawg.io/api/games?page_size=40&ordering=-metacritic&page=';
        let random = Math.floor(Math.random() * 20);
        let fetchedData = await getRAWG({link: link + random});
        let fetchedItems = JSON.parse(fetchedData.data);
        setSuggestions(fetchedItems);
    }

    const changePage = (num) => {
        if (!viewedPages.includes(num))
            fetchItems(num);
        setPage(num);
        setViewedPages(state => ([...state, page]));
    }
    
    return (
        <div id='search'>
            <h1>{header}</h1>
            {(platform === 'genre' || platform === undefined) ? 
            <div className='letters-links'>
                {letters.map(letter => {
                    return (
                        <Link key={letters.indexOf(letter)} to={`search/games/${letter}`}>{letter}</Link>
                    )
                })}
            </div>
            : ''}
            <div className='search-container'>
                <div className='search-box'>
                    <input onKeyDown={(e) => (e.keyCode === 13) ? redirect() : ''} onChange={(e) => setSearchVal(e.target.value)} 
                            placeholder='Search Games...' defaultValue={(platform !== 'genre') ? text : ''}></input>
                    <Link to={(searchVal !== '') ? `/search/all/${searchVal}` : `/search`}>
                        <img src={Icon} alt='search-icon'></img>
                    </Link>
                </div>
            </div>
            <div ref={scroll}></div>
            {(platform === 'all') ? 
            <h4 className='search-results'>{`Search results for "${text}"`}</h4>
            : ''}
            {(platform === undefined) ? 
            <div>
                <GamesCarousel games={suggestions} header={'Recommended Games'} slides={8}/>
                <h3>Genres</h3>
                <div className='genres links'>
                    {genresData.map( genre => {
                        let index = genresData.indexOf(genre);
                        let classNa = (index > 15) ? 'last' : '';
                        return (
                            <Link className={classNa} to={`/search/genre/${genre.name.replace(/ /g, '_')}`} key={index}>{`${genre.name} (${genre.gamesCount})`}</Link>
                        )
                    })}
                </div>
                <h3>By Year</h3>
                <div className='years links'>
                    {years.map( item => {
                        let index = years.indexOf(item);
                        let classNa = (index > 7) ? 'last' : '';
                        return (
                            <Link className={classNa} key={index} to={`/games-by-year/${item}`}>{item}</Link>
                        )
                    })}
                </div>
            </div>
            : ''}
            {(platform === 'genre') ?            
            (genresData.map(genre => {
                if (genre.name.replace(/ /g, '_') === text)
                    return (
                        <div className='genre'>
                            <h4>{genre.name}</h4>
                            <p>{genre.description}</p>
                        </div>
                    )
            }))            
            : ''}
            {(platform !== undefined && platform !== 'user' && games !== null) ?
            <div className='games-results'>
                {(platform === 'all') ?
                <h4>Games</h4>
                : ''}
                <div className='games'>
                    {games.map(game => {
                        let index = games.indexOf(game);
                        if (game.page === page)
                        return (
                            <GameCard key={index} game={game} firestore={firestore} />
                        )
                    })}
                    {(games.length === 0) ?
                    <p className='no-results'>No Games Found</p> 
                    : ''}
                </div>
                {(platform !== 'all') ?
                <div className='buttons'>
                    {(page > 2) ? <button onClick={(() => changePage(0))}>{buttons[0]}</button> : ''}
                    {(page > 2) ? <p>...</p> : ''}
                    {buttons.map(button => {
                        let index = buttons.indexOf(button);
                        if (buttons[index] !== undefined && index >= page - 2 && index <= page + 2)
                        return (
                            <button className={(index === page) ? 'current' : ''} disabled={(index === page) ? true : false} key={index} onClick={() => changePage(index)}>{buttons[index]}</button>
                        )
                    })}
                    {(page + 3 <= buttons.length) ? <p>...</p> : ''}
                    {(page + 3 <= buttons.length) ? <button onClick={(() => changePage(buttons.length - 1))}>{buttons[buttons.length - 1]}</button> : ''}                    
                </div>
                : 
                <div className='link-container'>
                    <Link className='link-to-search' to={`/search/games/${text}`}>
                        <img src={Image} alt='search-icon'></img>{` Search for "${text}" in Games`}</Link>
                </div>}
            </div>
            : ''}
            {((platform === 'user' || platform === 'all') && users !== null) ? 
            <div className='users-results'>
                {(platform === 'all') ?
                <h4>Users</h4>
                : ''}
                {(platform === 'user') ? 
                <div className='buttons'>
                    <p className={(page !== 0) ? 'on' : 'off'}>{'< '}<button disabled={(page !== 0) ? false : true} onClick={() => setPage(page-1)}>Prev</button></p>
                    <p className={(lastDoc !== null || page + 1 < users.length / 20) ? 'on' : 'off'}><button disabled={(lastDoc !== null) ? false : true} onClick={() => changePage(page + 1)}>Next</button>{' >'}</p>
                </div>
                :
                '' }
                <div className='users'>
                    {users.map(item => {
                        if (item.page === page)
                        return (
                            <div key={users.indexOf(item)} className='user'>
                                <Link className='image' to={`/user/${item.id}/${item.name.replace(/ /g, '_')}`}><img src={item.pic} alt={item.name}></img></Link>
                                <div className='info'>
                                    <Link className='name' to={`/user/${item.id}/${item.name.replace(/ /g, '_')}`}>{item.name}</Link>
                                    <p>{`${item.games.length} Games in List`}</p>
                                </div>
                            </div>
                        )
                    })}
                    {(users.length === 0) ?
                    <p className='no-results'>No Users Found</p> 
                    : ''}
                </div>
                {(platform === 'user') ? 
                <div className='buttons'>
                    <p className={(page !== 0) ? 'on' : 'off'}>{'< '}<button disabled={(page !== 0) ? false : true} onClick={() => setPage(page-1)}>Prev</button></p>
                    <p className={(lastDoc !== null) ? 'on' : 'off'}><button disabled={(lastDoc !== null) ? false : true} onClick={() => changePage(page + 1)}>Next</button>{' >'}</p>
                </div>
                :
                <div className='link-container'>
                    <Link className='link-to-search' to={`/search/user/${text}`}>
                        <img src={Image} alt='search-icon'></img>{` Search for "${text}" in Users`}</Link>    
                </div>}
            </div>
            :
            ''} 
        </div>
    );
};

export default Search;