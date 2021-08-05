import React from 'react';
import GameStage from './GameStage';
import {playerPopulation, numberOfFood} from '../config/GameStats';

const Game = () => {
    // TODO: movement
        // useEffect list of dependencies should include collision boolean
        // to see if re-render should happen
            // we don't want re-renders happening everytime we move the player
        // TODO: bots? 
    // TODO: collision

    return (
        <div>
            <GameStage population={playerPopulation} food={numberOfFood}/>
        </div>
    )
}

export default Game;