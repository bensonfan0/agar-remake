import React from 'react';
import GameStage from './GameStage';
import { playerPopulation, numberOfFood, playerSpeed } from '../config/GameStats';

const Game = () => {
    // TODO: movement
    // useEffect list of dependencies should include collision boolean
    // to see if re-render should happen
    // we don't want re-renders happening everytime we move the player
    // TODO: bots? 
    // TODO: collision

    return (
        <div>
            <GameStage
                population={playerPopulation}
                playerSpeed={playerSpeed}
                food={numberOfFood} />
        </div>
    )
}

export default Game;