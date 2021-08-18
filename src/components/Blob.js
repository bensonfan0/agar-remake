import React from 'react';


const Blob = (props) => {
    let blobY;
    let blobX;

    if (props.playerSettings !== undefined) {
        blobX = props.playerSettings.coordinates.x;
        blobY = props.playerSettings.coordinates.y;
    } else {
        blobX = props.coordinates.x;
        blobY = props.coordinates.y;
    }
    
    let radius = Math.sqrt(props.area / Math.PI)
    let sideLength = radius * 2;

    let blobStyle = {
        backgroundColor: 'black',
        height: `${sideLength}px`,
        width: `${sideLength}px`,
        borderRadius: '100%',
        top: `${blobY - radius}px`,
        left: `${blobX - radius}px`
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