import React from 'react';
import GameStage from './GameStage';
import { playerPopulation, botPopulation, foodNumber, playerAcceleration } from '../config/GameStats';

const Game = () => {
    // TODO: screen moves with coordinates 
    // TODO: able to 'shoot' half blob forward

    return (
        <div>
            <GameStage
                population={playerPopulation}
                botPopulation={botPopulation}
                playerAcceleration={playerAcceleration}
                food={foodNumber} />
        </div>
    )
}

export default Game;