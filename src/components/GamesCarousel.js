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
        prevArrow: <div></div>
    })
    useEffect(() => {
        if (games !== null) {
        filterData();
        setTimeout(() => {
            let buttons = divRef.current.querySelectorAll('button');
            buttons.forEach((button) => {
                button.childNodes.forEach(node => {
                    node.textContent = '';
                })
            })
            // this removes the custom prevArrow element that if not declared 
            // at first buttons are missing on the second carousel
            setSettings({
                arrowsScroll: 4,
                className: 'carousel',
                slidesToShow: 4,
                arrows: true, 
            })
        }, 500)
        }
    }, [items]);
    
    const filterData = () => {
        let aux = [];
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

    const emptyBox = {
        name: 'Fetching games..',
        pic: Spinner,
    }
    const emptyBoxes = [emptyBox, emptyBox, emptyBox, emptyBox];
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
            <Slider { ...settings}>
                {emptyBoxes.map(item => {
                        return(
                            <div key={emptyBoxes.indexOf(item)} className='game'>
                                <img className='loading' src={item.pic} alt={item.name}></img>
                                <p>{item.name}</p>
                            </div>
                        )
                })}
            </Slider>}
        </div>
    );
};

export default GamesCarousel;