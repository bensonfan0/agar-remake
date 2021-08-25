import React, { useState, useEffect } from 'react';
import GameStage from './gameStage';
import { connect } from '../networking/networking';
import { getCurrentState } from '../networking/state';


//let myConnection = connect('called to connect');

const Game = () => {
    // TODO: screen moves with coordinates 
    // TODO: able to 'shoot' half blob forward
    const pollInterval = 1000 / 120; // 30 updates a second
    const [data, setData] = useState(null);
    const [pollAgain, setPollAgain] = useState(0);


    // this should be where rendering happens --> this has to call getCurrentState...
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

    //console.log(GAME_CONFIGS);

    return (
        <div>
            <p>From server: {data}</p>
            <GameStage />
        </div>
    )
}

export default Game;