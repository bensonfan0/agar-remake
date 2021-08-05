import React, { useState } from 'react';
import Blob from './Blob';

// function components where 'props' is an object, and is passed as a parameter
const PlayerBlob = (props) => {
    let startSize = 50;

    const [size, setSize] = useState(startSize);
    const [{x,y}, setCoordinates] = useState(props.coordinates);
    console.log({x,y});

    return (
        // we can dynamically change these values if needed
        <Blob 
        isPlayer={true} 
        size={size} 
        playerName={'filler_name'} 
        coordinates={{x,y}}/>
    )
}

export default PlayerBlob;