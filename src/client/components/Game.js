import React from 'react';
import GameStage from './GameStage';
import { playerPopulation, botPopulation, foodNumber, playerAcceleration } from '../config/GameStats';
import { connect } from '../networking';

// server/index.js

const express = require("express");

const PORT = process.env.PORT || 3001;

const app = express();

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});


let areWeConnectedPromise = connect('called to connect');

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