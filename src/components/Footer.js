import Icon from '../icons/git-icon.svg';

const Footer = () => {
    return (
        <footer>
            <div></div>
            <div id='footer-container'>
                <p>Page built for <a href="https://www.theodinproject.com/">The Odin Project</a></p>
                <p>Based on <a href='https://myanimelist.net/'>My Anime List</a></p>
                <p>Games data retrieved from <a href='https://rawg.io/'>RAWG</a></p>
                <p>Developed by <a href='https://github.com/CarlosValdiviao-O'> Carlos Valdivia <img src={Icon} alt='git-icon'></img></a></p>
            </div>
        </footer>
    );
};

export default Footer;