import React, { useState, useEffect } from 'react';
import { randomRBGColor } from '../GameHelper';

let blobCenterCoordinates = { x: 0, y: 0 };

const Blob = (props) => {
    let blobY;
    let blobX;

    //console.log("IM INSIDE BLOB: ",props);

    if (props.playerSettings !== undefined) {
        blobX = props.playerSettings.coordinates.x;
        blobY = props.playerSettings.coordinates.y;
    } else {
        blobX = props.coordinates.x;
        blobY = props.coordinates.y;
    }

    let blobStyle = {
        backgroundColor: 'black',
        height: `${props.size}px`,
        width: `${props.size}px`,
        borderRadius: '100%',
        top: `${blobY}px`,
        left: `${blobX}px`
    };

    // note top == x and left == y

    if (props.playerSettings !== undefined) {
        blobStyle.backgroundColor = props.playerSettings.color;
    } else {
        blobStyle.backgroundColor = props.color;
    }
    return (
        <div className='blob' style={blobStyle}>
            {(props.playerSettings !== undefined ? props.playerSettings.playerName : '')}
        </div>
    )
}

export default Blob;