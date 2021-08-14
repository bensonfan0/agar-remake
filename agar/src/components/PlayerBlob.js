import React, { useState, useEffect } from 'react';
import Blob from './Blob';
import { randomRBGColor } from '../GameHelper';

let playerSettings = { playerName: 'filler_name', color: randomRBGColor(), coordinates: { x: 0, y: 0 } };

// function components where 'props' is an object, and is passed as a parameter
const PlayerBlob = (props) => {
    // NOTE: don't manipulate coordinates (b/c object) and return back to useState
    //       since it is pass by reference React won't know if original changed
    const [area, setarea] = useState(props.area);
    useEffect(() => {
        setarea(props.area);
    }, [props.area]);

    playerSettings.coordinates = props.coordinates;
    playerSettings.color = props.color;
    playerSettings.playerName = props.name;
    return (
        <Blob
            playerSettings={playerSettings}
            area={area}>
        </Blob>
    )
}

export default PlayerBlob;