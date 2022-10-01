import { useEffect, useRef, useState } from 'react';
import Slider from 'infinite-react-carousel';
import './ImagesCarousel.css';
import Image from './../icons/no-image.png'

const ImagesCarousel = (props) => {
    const { images } = props;
    const [ items, setItems ] = useState(null);
    const [ settings, setSettings ] = useState({
        arrowsScroll: 1,
        className: 'carousel',
        slidesToShow: 2,
        arrows: true, 
    })

    useEffect(() => {
        addEmptyImages();
        setTimeout(() => {
            let buttons = divRef.current.querySelectorAll('button');
            buttons.forEach((button) => {
                button.childNodes.forEach(node => {
                    node.textContent = '';
                })
            })
        }, 500) 
    }, [images]);
    
    const divRef = useRef();

    const addEmptyImages = () => {
        let aux = images;
        if (images.length < 2) {
            for (let i = 0; i < 2 - images.length; i++)
            aux.push(Image);
        }
        setItems(aux);
    }
    if (items !== null)
    return (
        <div ref={divRef}>
            <Slider { ...settings}>
                {items.map(item => {
                        return(
                            <div key={items.indexOf(item)} className='screenshot'>
                                <img src={item} alt='game-screenshot'></img>
                            </div>
                        )
                })}
            </Slider>
        </div>
    );
    else
    return <div></div>
};

export default ImagesCarousel;