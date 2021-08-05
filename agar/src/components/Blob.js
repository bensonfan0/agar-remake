import React from 'react';

const Blob = (props) => {
    // REQUIRED:
    // isPlayer=boolean, size=number
    let blobY;
    let blobX;

    const randomRBGColor = () => {
        let x = Math.floor(Math.random() * 256);
        let y = Math.floor(Math.random() * 256);
        let z = Math.floor(Math.random() * 256);
        return "rgb(" + x + "," + y + "," + z + ")";
    }

    if (!props.isPlayer) {
        blobY = Math.floor(Math.random() * window.innerHeight);
        blobX = Math.floor(Math.random() * window.innerWidth);
    } else {
        blobX = props.coordinates.x;
        blobY = props.coordinates.y;
    }

    const foodStyle = {
        backgroundColor: randomRBGColor(),
        height: `${props.size}px`,
        width: `${props.size}px`,
        borderRadius: '80%', 
        top: `${blobY}px`,
        left: `${blobX}px`
    }

    return (
        <div className='blob' style={foodStyle}>
            {props.playerName}
        </div>
    )
}

export default Blob;