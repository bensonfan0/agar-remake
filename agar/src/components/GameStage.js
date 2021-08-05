import React from 'react';
import PlayerBlob from './PlayerBlob';
import Food from './Food';

const randomSpawn = () => {
    let spawnCoordinates = {x:0,y:0};
    spawnCoordinates.x = Math.random() * window.innerWidth;
    spawnCoordinates.y = Math.random() * window.innerHeight;

    return spawnCoordinates;
}

const GameStage = (props) => {
    let listOfPlayerBlob = [];
    let listOfFood = [];

    for (let i = 0; i < props.population; i++) {
        listOfPlayerBlob[i] = <PlayerBlob key={i} coordinates={randomSpawn()}/>
    }

    for (let i = 0; i < props.food; i++) {
        listOfFood[i] = <Food key={i}/>
    }

    console.log(listOfPlayerBlob);
    console.log(listOfFood);

   return (
    <div>
        {listOfPlayerBlob}
        {listOfFood}
    </div>
   )
}

export default GameStage;