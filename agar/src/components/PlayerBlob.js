import React, { useState, useEffect } from 'react';
import Blob from './Blob';
import {randomRBGColor} from '../GameHelper';

let maxAcceleration = 2;

let dx = 0;
let dy = 0;

let startSize = 50;
let playerSettings = { playerName:'filler_name', color:randomRBGColor(), coordinates:{x:0,y:0} };

// function components where 'props' is an object, and is passed as a parameter
const PlayerBlob = (props) => {
    
    const [timer, setTimer] = useState(0);
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
        // if ((xCoordBehindMouse && dx > 0) || (!xCoordBehindMouse && dx < 0)) {
        //     dx = 0;
        // } else 

        let doDoubleTakeSpeed = playerSpeed*8;
        if (xCoordBehindMouse) {
            if (dx < 0) {
                dx += -playerSpeed;
            } else {
                // accelerating wrong direction - do a double take
                dx += -doDoubleTakeSpeed;
            }
        } else if (!xCoordBehindMouse){
            if (dx > 0) {
                dx += playerSpeed;
            } else {
                // accelerating wrong direction - do a double take
                dx += doDoubleTakeSpeed;
            }
        }
        
        // handle y direction acceleration
        let yCoordBelowMouse = event.y < coordinates.y;
        // if ((yCoordBelowMouse && dy > 0) || (!yCoordBelowMouse && dy < 0)) {
        //     dy = 0;
        // } else 
        
        if (yCoordBelowMouse){
            if (dy < 0) {
                dy += -playerSpeed;
            } else {
                dy += -doDoubleTakeSpeed;
            }
        } else if (!yCoordBelowMouse){
            if (dy > 0) {
                dy += playerSpeed;
            } else {
                dy += doDoubleTakeSpeed;
            }
        } 

        console.log("dx dy", dx, dy);

        // update coordinates
        let newCoordinates = {x:coordinates.x, y:coordinates.y};
        newCoordinates.x += dx;
        newCoordinates.y += dy;

        //console.log("new coordinates", newCoordinates);
        setCoordinates(newCoordinates);
    }
    
    const handleMouseMove = (event) => {
        movePlayer(event, props.playerSpeed);
    };

    useEffect(() => {
        //console.log("inside useEffect!!", coordinates);
        window.addEventListener("mousemove", handleMouseMove);
        //console.log("addedEventListener", coordinates);

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            console.log("removedEventListener", coordinates);
        }
    }, [coordinates, timer]);

    // why doesn't it get rerendered....
    console.log("I am getting re-rendered!");


    playerSettings.coordinates = coordinates;
    console.log("these are the coordinates!", coordinates);
    return (
        <Blob 
        playerSettings={playerSettings}
        size={size}>
        </Blob>
        )
    // <div className='blob'>
    //     <p>
    //         x:{coordinates.x} - y:{coordinates.y}
    //     </p>
    // </div>
}

export default PlayerBlob;