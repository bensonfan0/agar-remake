import React, { useState, useEffect } from 'react';
import Blob from './Blob';
import { randomRBGColor } from '../GameHelper';
import useMouseFollow from '../hooks/useMouseFollow';

let maxAcceleration = 2;

let dx = 0;
let dy = 0;

let mouseLastCoordinates = { x: 0, y: 0 };

//let startSize = 50;
let playerSettings = { playerName: 'filler_name', color: randomRBGColor(), coordinates: { x: 0, y: 0 } };

// function components where 'props' is an object, and is passed as a parameter
const PlayerBlob = (props) => {
    const [size, setSize] = useState(props.size);
    useEffect(() => {
        setSize(props.size);
    }, [props.size]);
    // NOTE: don't manipulate coordinates (b/c object) and return back to useState
    //       since it is pass by reference React won't know if original changed
    const [coordinates, setCoordinates] = useState(props.coordinates);

    playerSettings.coordinates = props.coordinates;
    playerSettings.color = props.color;
    playerSettings.playerName = props.name;
    //console.log("name", props.name);
    //console.log(size);
    return (
        <Blob
            playerSettings={playerSettings}
            size={size}>
        </Blob>
    )
}

export default PlayerBlob;