import React, { useState, useEffect } from 'react';
import Blob from './Blob';
import { randomRBGColor, checkCollision } from '../GameHelper';
import useMouseFollow from '../hooks/useMouseFollow';

let maxAcceleration = 2;

let dx = 0;
let dy = 0;

let mouseLastCoordinates = { x: 0, y: 0 };

let startSize = 50;
let playerSettings = { playerName: 'filler_name', color: randomRBGColor(), coordinates: { x: 0, y: 0 } };

// function components where 'props' is an object, and is passed as a parameter
const PlayerBlob = (props) => {
    //const [seconds, setSeconds] = useState(0);
    const [size, setSize] = useState(startSize);
    // NOTE: don't manipulate coordinates (b/c object) and return back to useState
    //       since it is pass by reference React won't know if original changed
    const [coordinates, setCoordinates] = useState(props.coordinates);


    const movePlayer = (event, playerSpeed) => {
        //console.log("mouse position",event.x,event.y);
        //console.log("current coordinates", coordinates);
        //console.log("this is prop speed", playerSpeed);

        // handle x direction acceleration
        let xCoordBehindMouse = event.x < coordinates.x;
        // handle y direction acceleration
        let yCoordBelowMouse = event.y < coordinates.y;
        let doDoubleTakeSpeed = playerSpeed * 6;

        if (xCoordBehindMouse) {
            if (dx < 0) {
                dx += -playerSpeed;
            } else {
                // accelerating wrong direction - do a double take
                dx += -doDoubleTakeSpeed;
            }
        } else if (!xCoordBehindMouse) {
            if (dx > 0) {
                dx += playerSpeed;
            } else {
                // accelerating wrong direction - do a double take
                dx += doDoubleTakeSpeed;
            }
        }
        if (yCoordBelowMouse) {
            if (dy < 0) {
                dy += -playerSpeed;
            } else {
                dy += -doDoubleTakeSpeed;
            }
        } else if (!yCoordBelowMouse) {
            if (dy > 0) {
                dy += playerSpeed;
            } else {
                dy += doDoubleTakeSpeed;
            }
        }

        console.log("dx dy", dx, dy);

        // update coordinates
        let newCoordinates = { x: coordinates.x, y: coordinates.y };
        newCoordinates.x += dx;
        newCoordinates.y += dy;

        //console.log("new coordinates", newCoordinates);
        setCoordinates(newCoordinates);
    }

    const handleMouseMove = (event) => {
        mouseLastCoordinates = event;
        movePlayer(event, props.playerSpeed);
    };

    const handleMovePlayer = () => {
        movePlayer(mouseLastCoordinates, props.playerSpeed);
    }

    // useEffect(() => {
    //     //console.log("inside useEffect!!", coordinates);
    //     window.addEventListener("mousemove", handleMouseMove);
    //     const interval = setInterval(() => {
    //         // call handleMouseMove every x ms 
    //         movePlayer(mouseLastCoordinates, props.playerSpeed);
    //         console.log('These are the mousesLastCoordinates coordinates:', mouseLastCoordinates);
    //         //setSeconds(seconds + 1);
    //     }, 1000000);
    //     //console.log("addedEventListener", coordinates);

    //     return () => {
    //         window.removeEventListener("mousemove", handleMouseMove);
    //         clearInterval(interval);
    //         //console.log("removedEventListener");
    //     }
    // }, [coordinates]);

    playerSettings.coordinates = coordinates;
    //console.log("these are the coordinates!", coordinates);
    return (
        <Blob
            playerSettings={playerSettings}
            size={size}>
        </Blob>
    )
}

export default PlayerBlob;