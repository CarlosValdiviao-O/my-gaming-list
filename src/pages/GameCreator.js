import { useState } from "react"

const GameCreator = (props) => {
    const { firebase } = props;
    const [ year, setYear ] = useState(null);
    const getRAWG = firebase.functions().httpsCallable('getRAWG');
    const createGame = firebase.functions().httpsCallable('createGame');

    const createGames = async () => { 
        const link = 'https://api.rawg.io/api/games?';
        let games = await fetchGames(link + `dates=${year}-01-01,${year}-12-01`);
        games.results.forEach(game => {
            if (![318065, 3328, 341123, 3498, 452638, 791638].includes(game.id)) {
                console.log(game.name);
                let resp = createGame({id: game.id});
            }
        })
    }

    const fetchGames = async (link) => {
        let games = await getRAWG({link: link});
        return JSON.parse(games.data);
    }

    return (
        <div>
            <input onChange={(e) => setYear(e.target.value)}></input>
            <button onClick={createGames}>click</button>
        </div>
    )
}

//last 1998

export default GameCreator