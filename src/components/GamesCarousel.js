import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import Slider from 'infinite-react-carousel';
import Spinner from '../icons/spinner.gif';
import './GamesCarousel.css';
import Image from './../icons/no-image.png';

const GamesCarousel = (props) => {
    const { games, header, slides } = props;
    const [ items, setItems ] = useState(null);
    const [ settings, setSettings ] = useState({
        arrowsScroll: slides,
        className: 'carousel',
        slidesToShow: slides,
        arrows: true, 
    })

    useEffect(() => {
        if (header === 'Related Games')
        filterFirebaseData();
        else
        filterRawgData();
        setTimeout(() => {
            let buttons = divRef.current.querySelectorAll('button');
            buttons.forEach((button) => {
                button.childNodes.forEach(node => {
                    node.textContent = '';
                })
            })
        }, 500)
        
    }, [games]);
    
    const filterRawgData = () => {
        let aux = [];
        if (games === null || items !== null) return;
        let count = (games.count > 20) ? 20 : games.count;
        for (let i = 0; i < count; i++) {
            aux[i] = {
                name: games.results[i].name,
                pic: games.results[i].background_image,
                link: '/game/' + games.results[i].id + '/' + games.results[i].name.replace(/\/| /g, '_'),
                index: i,
            }
        }
        setItems(aux);
    }

    const filterFirebaseData = () => {
        let aux = [];
        for (let i = 0; i < games.length; i ++) {
            aux[i] = {
                name: games[i].name,
                pic: games[i].img,
                link: '/game/' + games[i].id + '/' + games[i].name.replace(/\/| /g, '_'),
                index: i,
            }
        }
        setItems(aux);
    }

    const divRef = useRef();

    let emptyBoxes = [];
    for (let i = 0; i < 8; i++){
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
                                <img src={(item.pic !== null && item.pic !== '') ? item.pic : Image} alt={item.name}></img>
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