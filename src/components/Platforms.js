import { Link } from 'react-router-dom';

const Platforms = () => {
    const today = new Date();
    const items = [
        {
            name: 'Games',
            links: [
                {name: 'Top Games', linkTo: '/top-games/all-time'},
                {name: 'Games by Year', linkTo: '/games-by-year/' + today.getFullYear()},
                {name: 'Search Games', linkTo: '/search/all/all'},
                {name: 'Games Reviews', linkTo: '/reviews'},
            ]
        },
        {
            name: 'PlayStation',
            links: [
                {name: 'Top PS5 Games', linkTo: '/top-games/ps5'},
                {name: 'Top PS4 Games', linkTo: '/top-games/ps4'},
                {name: 'Top PS3 Games', linkTo: '/top-games/ps3'},
                {name: 'Top PS2 Games', linkTo: '/top-games/ps2'},
                {name: 'Top PS1 Games', linkTo: '/top-games/ps1'},
            ]
        },
        {
            name: 'Nintendo',
            links: [
                {name: 'Top Switch Games', linkTo: '/top-games/switch'},
                {name: 'Top Wii U Games', linkTo: '/top-games/wii-u'},
                {name: 'Top 3DS Games', linkTo: '/top-games/3ds'},
                {name: 'Top Wii Games', linkTo: '/top-games/wii'},
                {name: 'Top Gamecube Games', linkTo: '/top-games/gamecube'},
                {name: 'Top DS Games', linkTo: '/top-games/ds'},
            ]
        },
        {
            name: 'Microsoft',
            links: [
                {name: 'Top Xbox Series X Games',  linkTo: '/top-games/xbox-series-x'},
                {name: 'Top Xbox One Games',  linkTo: '/top-games/xbox-one'},
                {name: 'Top Xbox 360 Games',  linkTo: '/top-games/xbox-360'},
                {name: 'Top Xbox Games', linkTo: '/top-games/xbox'},
            ]
        },
        {
            name: 'PC',
            links: [
                {name: 'Top PC Games', linkTo: '/top-games/pc'},
            ]
        }
    ];

    return (
        <div id='platforms'>
            {items.map(item => {
                const index = items.indexOf(item);
                return(
                    <div className='platform' key={index}>
                        <h4 className='platform-name'>{item.name}</h4>
                        <div className='platform-links'>
                            {item.links.map(link => {
                                return(
                                    <Link to={link.linkTo} key={item.links.indexOf(link)}>
                                        <button>{link.name}</button>
                                    </Link>
                                )
                            })}
                        </div>
                    </div>
                )
            })}
        </div>
    );
};

export default Platforms;