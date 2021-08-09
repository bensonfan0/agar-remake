import React, { useState, useEffect } from 'react';
import { randomRBGColor } from '../GameHelper';

let blobCenterCoordinates = { x: 0, y: 0 };

const Blob = (props) => {
    let blobY;
    let blobX;

    if (props.playerSettings !== undefined) {
        blobX = props.playerSettings.coordinates.x;
        blobY = props.playerSettings.coordinates.y;
    } else {
        blobY = Math.floor(Math.random() * window.innerHeight);
        blobX = Math.floor(Math.random() * window.innerWidth);
    }

    let blobStyle = {
        backgroundColor: randomRBGColor(),
        height: `${props.size}px`,
        width: `${props.size}px`,
        borderRadius: '80%',
        top: `${blobY}px`,
        left: `${blobX}px`
    };


    // note top == x and left == y

    if (props.playerSettings !== undefined) {
        blobStyle.backgroundColor = props.playerSettings.color;
    }

    return (
        <div className='blob' style={blobStyle}>
            {(props.playerSettings !== undefined ? props.playerSettings.playerName : '')}
        </div>
    )
}

export default React.memo(Blob);