import React, { useState, useEffect } from 'react';
import GameStage from './gameStage';
import { GAME_CONFIGS } from '../config/gameConfigs';
import { connect } from '../networking';


let areWeConnectedPromise = connect('called to connect');

const Game = () => {
    // TODO: screen moves with coordinates 
    // TODO: able to 'shoot' half blob forward
    const pollInterval = 1000 / 120; // 30 updates a second
    const [data, setData] = useState(null);
    const [pollAgain, setPollAgain] = useState(0);


    // this should be where rendering happens
    useEffect(() => {
        fetch("/api")
        .then(res => res.json())
        .then(data => setData(data.message));
        
        const interval = setInterval(() => {
            setPollAgain(pollAgain + 1);
        }, pollInterval); // 1000 ms / 60 frames -> 62.5 ms / 1 frame
        
        return () => {
            clearInterval(interval);
        }
    }, [pollAgain]);

    return (
        <div>
            <p>From server: {data}</p>
            <GameStage
                population={GAME_CONFIGS.PLAYER_POPULATION}
                botPopulation={GAME_CONFIGS.BOT_POPULATION}
                playerAcceleration={GAME_CONFIGS.PLAYER_ACCELERATION}
                food={GAME_CONFIGS.FOOD_NUMBER} />
        </div>
    )
}

export default Game;