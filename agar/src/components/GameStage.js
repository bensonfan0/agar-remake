import React, { useState, useEffect } from 'react';
import { isCollidingPlayer, isCollidingFood, newPlayerCoordinates, randomRBGColor } from '../GameHelper';
import PlayerBlob from './PlayerBlob';
import Food from './Food';
import { playerStartSize, playerSpeed ,foodSize } from '../config/GameStats';
import { render } from 'react-dom';

const randomSpawn = () => {
    let spawnCoordinates = { x: 0, y: 0 };
    spawnCoordinates.x = Math.random() * window.innerWidth;
    spawnCoordinates.y = Math.random() * window.innerHeight;

    return spawnCoordinates;
}

const setUpPlayers = (gameStageProps, listOfPlayerBlob, listOfFood) => {
    for (let i = 0; i < gameStageProps.population; i++) {
        listOfPlayerBlob[i] = <PlayerBlob key={i} playerSpeed={gameStageProps.playerSpeed} coordinates={randomSpawn()} size={playerStartSize} acceleration={{dx:0, dy:0}} color={randomRBGColor()}/>;
    }
    for (let j = 0; j < gameStageProps.food; j++) {
        listOfFood[j] = <Food key={j} size={foodSize} coordinates={randomSpawn()} color={randomRBGColor()}/>;
    }
}

const GameStage = (props) => {
    const [renderTime, setRenderTime] = useState(0);
    const [mouseCoordinates, setMouseCoordinates] = useState({x:0,y:0});
    const [listOfPlayerBlob, setListOfPlayerBlob] = useState([]);
    const [listOfFood, setListOfFood] = useState([]);

    //console.log(listOfPlayerBlob);

    if (listOfPlayerBlob.length === 0) {
        //console.log("im being called!");
        setUpPlayers(props, listOfPlayerBlob, listOfFood);
    } 

    //console.log(listOfPlayerBlob, listOfFood);

    const setMouseLastPosition = (event) => {
        moveListOfPlayerBlob();
        setMouseCoordinates({x:event.x,y:event.y});
        //console.log(event, mouseCoordinates);
    };
    
    
    useEffect(() => {
        window.addEventListener("mousemove", setMouseLastPosition);
        moveListOfPlayerBlob();
        const interval = setInterval(() => {
            setRenderTime(renderTime + 1);
        }, 50);

        return () => {
            window.removeEventListener("mousemove", setMouseLastPosition);
            clearInterval(interval);
        }
    }, [mouseCoordinates, renderTime]);

    //console.log("I am getting rendered sandwich!");
    const moveListOfPlayerBlob = () => {
        // TODO: clean up playerBlob
        // TODO: add movement
        // TODO: add collision detection

        //console.log("OLD: ", listOfPlayerBlob);
        // console.log("MOUSECOORDINATES: ", mouseCoordinates);
        // remember don't mutate the state itself becase pass by reference
        let newListOfPLayerBlob = [];
        for (let i = 0; i < listOfPlayerBlob.length; i++) {
            //console.log("INSIDE FOR LOOP");
            // move each playerBlob
            // check for collision
            //console.log("this is playerBlob", listOfPlayerBlob[i]);
            let [newCoordinates, newAcceleration] = newPlayerCoordinates(listOfPlayerBlob[i].props.coordinates, mouseCoordinates, listOfPlayerBlob[i].props.acceleration, playerSpeed);
            //let [newCoordinates, newAcceleration] = [mouseCoordinates, {dx:0, dy:0}]
            //console.log(newAcceleration);
            //console.log(newCoordinates);
            let newSize = listOfPlayerBlob[i].props.size;
            let [isColliding, FoodToRemove] = isCollidingFood(listOfPlayerBlob[i], listOfFood);
            if (isColliding) {
                updateFood(FoodToRemove);
                newSize += + 5;
                // move player
                // console.log("I'm getting collided!");
            }

            if (isCollidingPlayer(listOfPlayerBlob[i], listOfPlayerBlob)) {
                // smaller player is consumed
                // increase size
                // move player
            }
            //console.log(newSize);
            newListOfPLayerBlob[i] = <PlayerBlob key={i} coordinates={newCoordinates} playerSpeed={listOfPlayerBlob[i].props.playerSpeed} size={newSize} acceleration={newAcceleration}/>
        }
        //console.log("old players: ", listOfPlayerBlob);
        //console.log("new players: ", newListOfPLayerBlob);

        setListOfPlayerBlob(newListOfPLayerBlob);
    }

    const updateFood = (foodToRemove) => {
        let indexToRemove = listOfFood.findIndex(element => element === foodToRemove);
        //console.log("indexToRemove", indexToRemove);
        let newListOfFood = [];
        for (let i = 0; i < listOfFood.length; i++) {
            let foodCoordinates = (i === indexToRemove ? randomSpawn() : listOfFood[i].props.coordinates);
            let foodColor = (i === indexToRemove ? randomRBGColor() : listOfFood[i].props.coordinates)
            newListOfFood[i] = <Food key={i} size={foodSize} coordinates={foodCoordinates} color={foodColor}/>;
        }
        //console.log(listOfFood);
        //console.log(newListOfFood);
        setListOfFood(newListOfFood);
    }

    //console.log("I am getting rendered!!", listOfPlayerBlob);

    return (
        <div>
            {listOfFood}
            {listOfPlayerBlob}
        </div>
    )
}

export default GameStage;