import React from 'react';
import GameStage from './GameStage';
import { playerPopulation, botPopulation, foodNumber, playerSpeed } from '../config/GameStats';

const Game = () => {
    // TODO: screen moves with component
    // TODO: bots? 

    return (
        <div>
            <GameStage
                population={playerPopulation}
                botPopulation={botPopulation}
                playerSpeed={playerSpeed}
                food={foodNumber} />
        </div>
    )
}

export default Game;