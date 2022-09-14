import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Slider from 'infinite-react-carousel';
import Spinner from '../icons/spinner.gif';
import './GamesCarousel.css';

const GamesCarousel = (props) => {
    const { games, header } = props;
    const [ items, setItems ] = useState(null);
    const [ settings, setSettings ] = useState({
        arrowsScroll: 4,
        className: 'carousel',
        slidesToShow: 4,
        arrows: true, 
    })

    useEffect(() => {
        filterData();
        setTimeout(() => {
            let buttons = divRef.current.querySelectorAll('button');
            buttons.forEach((button) => {
                button.childNodes.forEach(node => {
                    node.textContent = '';
                })
            })
        }, 500)
        
    }, [games]);
    
    const filterData = () => {
        let aux = [];
        if (games === null || items !== null) return;
        let count = (games.count > 20) ? 20 : games.count;
        for (let i = 0; i < count; i++) {
            aux[i] = {
                name: games.results[i].name,
                pic: games.results[i].background_image,
                link: '/game/' + games.results[i].id,
                index: i,
            }
        }
        setItems(aux);
    }

    const divRef = useRef();

    let emptyBoxes = [];
    for (let i = 0; i < 4; i++){
        emptyBoxes[i] = {
            name: 'Fetching games..',
            pic: Spinner,
            index: i,
        }
    }
    
    return (
        <div ref={divRef} className='section'>
            <h3>{header}</h3>
            {(items !== null) ? 
            <Slider { ...settings}>
                {items.map(item => {
                        return(
                            <Link key={items.indexOf(item)} className='game' to={item.link}>
                                <img src={item.pic} alt={item.name}></img>
                                <p>{item.name}</p>
                            </Link>
                        )
                })}
            </Slider>
            :
            <div className='empty-boxes carousel'>
                {emptyBoxes.map(item => {
                    return(
                        <div key={item.index} className='game'>
                            <img src={item.pic} alt={item.name}></img>
                            <p>{item.name}</p>
                        </div>
                    )
                })}
            </div>}
        </div>
    );
};

export default GamesCarousel;