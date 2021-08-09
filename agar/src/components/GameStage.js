import React, { useState, useEffect } from 'react';
import { moveListOfPlayerBlob } from '../GameHelper';
import PlayerBlob from './PlayerBlob';
import Food from './Food';

let mouseLastCoordinates = { x: 0, y: 0 };

const randomSpawn = () => {
    let spawnCoordinates = { x: 0, y: 0 };
    spawnCoordinates.x = Math.random() * window.innerWidth;
    spawnCoordinates.y = Math.random() * window.innerHeight;

    return spawnCoordinates;
}

const GameStage = (props) => {
    let listOfPlayerBlob = [];
    let listOfFood = [];

    for (let i = 0; i < props.population; i++) {
        listOfPlayerBlob[i] = <PlayerBlob key={i} playerSpeed={props.playerSpeed} coordinates={randomSpawn()} />
    }

    for (let i = 0; i < props.food; i++) {
        listOfFood[i] = <Food key={i} />
    }

    
    const setMouseLastPosition = (event) => {
        mouseLastCoordinates = {x:event.x,y:event.y};
        console.log(event, mouseLastCoordinates);
    };
    
    
    useEffect(() => {
        window.addEventListener("mousemove", setMouseLastPosition);
        const interval = setInterval(() => {
            moveListOfPlayerBlob(listOfPlayerBlob, mouseLastCoordinates)
        }, 10000);

        return () => {
            window.removeEventListener("mousemove", setMouseLastPosition);
            clearInterval(interval);
        }
    }, []);

    console.log(listOfPlayerBlob);
    console.log(listOfFood);

    return (
        <div>
            {listOfFood}
            {listOfPlayerBlob}
        </div>
    )
}

export default GameStage;