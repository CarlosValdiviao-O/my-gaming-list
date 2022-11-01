import { Link } from 'react-router-dom';

const Platforms = () => {
    const today = new Date();
    const items = [
        {
            name: 'Games',
            links: [
                {name: 'Top Games', linkTo: '/top-games/All-Time'},
                {name: 'Games by Year', linkTo: '/games-by-year/' + today.getFullYear()},
                {name: 'Search Games', linkTo: '/search'},
                {name: 'Games Reviews', linkTo: '/reviews'},
            ]
        },
        {
            name: 'PlayStation',
            links: [
                {name: 'Top PS5 Games', linkTo: '/top-games/PlayStation-5'},
                {name: 'Top PS4 Games', linkTo: '/top-games/PlayStation-4'},
                {name: 'Top PS3 Games', linkTo: '/top-games/PlayStation-3'},
                {name: 'Top PS2 Games', linkTo: '/top-games/PlayStation-2'},
                {name: 'Top PS1 Games', linkTo: '/top-games/PlayStation'},
            ]
        },
        {
            name: 'Nintendo',
            links: [
                {name: 'Top Switch Games', linkTo: '/top-games/Nintendo-Switch'},
                {name: 'Top Wii U Games', linkTo: '/top-games/Wii-U'},
                {name: 'Top 3DS Games', linkTo: '/top-games/Nintendo-3DS'},
                {name: 'Top Wii Games', linkTo: '/top-games/Wii'},
                {name: 'Top GameCube Games', linkTo: '/top-games/GameCube'},
                {name: 'Top DS Games', linkTo: '/top-games/Nintendo-DS'},
            ]
        },
        {
            name: 'Microsoft',
            links: [
                {name: 'Top Xbox Series S/X Games',  linkTo: '/top-games/Xbox-Series-S-X'},
                {name: 'Top Xbox One Games',  linkTo: '/top-games/Xbox-One'},
                {name: 'Top Xbox 360 Games',  linkTo: '/top-games/Xbox-360'},
                {name: 'Top Xbox Games', linkTo: '/top-games/Xbox'},
            ]
        },
        {
            name: 'PC',
            links: [
                {name: 'Top PC Games', linkTo: '/top-games/PC'},
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