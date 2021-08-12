import React, { useState, useEffect } from 'react';
import { isCollidingPlayer, isCollidingFood, newPlayerCoordinates, newBotCoordinates, randomRBGColor } from '../GameHelper';
import PlayerBlob from './PlayerBlob';
import Food from './Food';
import { playerStartSize, playerSpeed ,foodSize, maxAccelerationNumerator, botPopulation } from '../config/GameStats';
import { render } from 'react-dom';

const randomSpawn = () => {
    let spawnCoordinates = { x: 0, y: 0 };
    spawnCoordinates.x = Math.random() * window.innerWidth;
    spawnCoordinates.y = Math.random() * window.innerHeight;

    return spawnCoordinates;
}

const setUpPlayers = (gameStageProps, listOfPlayerBlob, listOfBotBlob, listOfFood, listOfRandomCoord) => {
    for (let i = 0; i < gameStageProps.population; i++) {
        listOfPlayerBlob[i] = <PlayerBlob key={i} name={'filler_name'} playerSpeed={gameStageProps.playerSpeed} coordinates={randomSpawn()} size={playerStartSize} acceleration={{dx:0, dy:0}} maxAcceleration={maxAccelerationNumerator/playerStartSize} color={randomRBGColor()}/>;
    }

    for (let i = 0; i < gameStageProps.botPopulation; i++) {
        listOfBotBlob[i] = <PlayerBlob key={i} name={`bot_${i}`} playerSpeed={gameStageProps.playerSpeed} coordinates={randomSpawn()} size={playerStartSize} acceleration={{dx:0, dy:0}} maxAcceleration={maxAccelerationNumerator/playerStartSize} color={randomRBGColor()}/>;
    }

    for (let j = 0; j < gameStageProps.food; j++) {
        listOfFood[j] = <Food key={j} size={foodSize} coordinates={randomSpawn()} color={randomRBGColor()}/>;
    }

    for (let i = 0; i < botPopulation; i++) {
        listOfRandomCoord[i] = {x:Math.random() * window.innerWidth, y:Math.random() * window.innerHeight};
    }
}

const GameStage = (props) => {
    const [renderTime, setRenderTime] = useState(0);
    const [mouseCoordinates, setMouseCoordinates] = useState({x:0,y:0});

    const [listOfRandomCoord, setRandomCoordinates] = useState([]);
    const [listOfPlayerBlob, setListOfPlayerBlob] = useState([]);
    const [listOfBotBlob, setListOfBotBlob] = useState([]);
    const [listOfFood, setListOfFood] = useState([]);
    //console.log(listOfBotBlob);
    //console.log(listOfPlayerBlob);

    //console.log(listOfPlayerBlob);

    if (listOfPlayerBlob.length === 0) {
        //console.log("im being called!");
        setUpPlayers(props, listOfPlayerBlob, listOfBotBlob, listOfFood, listOfRandomCoord);
    } 

    //console.log(listOfPlayerBlob, listOfFood);

    const setMouseLastPosition = (event) => {
        //moveListOfPlayerBlob();
        setMouseCoordinates({x:event.x,y:event.y});
        //console.log(event, mouseCoordinates);
    };

    useEffect(() => {
        window.addEventListener("mousemove", setMouseLastPosition);

        return () => {
            window.removeEventListener("mousemove", setMouseLastPosition);
        }
    }, [mouseCoordinates])
    
    
    useEffect(() => {
        moveListOfPlayerBlob();
        const interval = setInterval(() => {
            setRenderTime(renderTime + 1);
        }, 20); // every 20ms render

        return () => {
            clearInterval(interval);
        }
    }, [renderTime]);

    //console.log("I am getting rendered sandwich!");
    const moveListOfPlayerBlob = () => {
        let newListOfPLayerBlob = [];
        let newListOfBotBlob = [];
        let newlistOfRandomCoord = [];

        
        for (let i = 0; i < listOfPlayerBlob.length; i++) {
            newListOfPLayerBlob[i] = handlePlayerMove(listOfPlayerBlob[i], i);
        }
        for (let i = 0; i < listOfBotBlob.length; i++) {
            newListOfBotBlob[i] = handleBotMove(listOfBotBlob[i], listOfRandomCoord[i], i);
        }
        
        // some interval every 10000 / 20 ms
        if (renderTime % 100 === 0) {
            for (let i = 0; i < listOfRandomCoord.length; i++) {
                newlistOfRandomCoord[i] = {x:Math.random() * window.innerWidth, y:Math.random() * window.innerHeight};
            }
            setRandomCoordinates(newlistOfRandomCoord);
        }

        setListOfBotBlob(newListOfBotBlob);
        setListOfPlayerBlob(newListOfPLayerBlob);
    }

    const handleBotMove = (botBlob, botCoordinates, i) => {
        return blobMove(botBlob, botCoordinates, listOfBotBlob, i);
    }

    const handlePlayerMove = (playerBlob, i) => {
        return blobMove(playerBlob, mouseCoordinates, listOfPlayerBlob, i);
    }

    const blobMove = (blob, moveToCoordinates, listOfAliveBlob, i) => {
        let [newCoordinates, newAcceleration] = newPlayerCoordinates(blob.props.coordinates, moveToCoordinates, blob.props.acceleration, playerSpeed);
        
        newAcceleration = accelerationNotExceedingMax(newAcceleration, blob.props.maxAcceleration);
        
        let newSize = blob.props.size;
        let newPlayerSpeed = blob.props.playerSpeed;
        let playerColor = blob.props.color;
        let [isColliding, FoodToRemove] = isCollidingFood(blob, listOfFood);
        if (isColliding) {
            updateFood(FoodToRemove);
            newSize += + 5;
            (newPlayerSpeed *= 1/2 < Number.MIN_VALUE ? newPlayerSpeed *= 1/2 : newPlayerSpeed = Number.MIN_VALUE)
        }

        if (isCollidingPlayer(blob, listOfAliveBlob)) {

        }
        return <PlayerBlob key={i} name={blob.props.name} coordinates={newCoordinates} playerSpeed={newPlayerSpeed} size={newSize} acceleration={newAcceleration} maxAcceleration={maxAccelerationNumerator/newSize} color={playerColor}/>;
    }

    const accelerationNotExceedingMax = (acceleration, maxAcceleration) => {
        let xSign = Math.sign(acceleration.dx);
        let ySign = Math.sign(acceleration.dy);

        let dx = (Math.abs(acceleration.dx) > maxAcceleration ? maxAcceleration * xSign : acceleration.dx);
        let dy = (Math.abs(acceleration.dy) > maxAcceleration ? maxAcceleration * ySign : acceleration.dy);
        //console.log(dx, dy);
        return {dx:dx, dy:dy}
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
            {listOfBotBlob}
        </div>
    )
}

export default GameStage;