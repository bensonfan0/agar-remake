import React, { useState, useEffect } from 'react';
import {
    isCollidingPlayer,
    isCollidingFood,
    newPlayerCoordinates,
    randomRBGColor,
    blobElasticCollision
} from '../GameHelper';
import PlayerBlob from './PlayerBlob';
import Food from './Food';
import {
    playerStartArea,
    playerAcceleration,
    foodArea,
    maxVelocityNumerator,
    botPopulation,
    consumableRatio,
    maxArea
} from '../config/GameStats';

const randomSpawn = () => {
    let spawnCoordinates = { x: 0, y: 0 };
    spawnCoordinates.x = Math.random() * window.innerWidth;
    spawnCoordinates.y = Math.random() * window.innerHeight;

    return spawnCoordinates;
}

const setUpPlayers = (gameStageProps,
    listOfPlayerBlob,
    listOfBotBlob,
    listOfFood,
    listOfRandomCoord) => {
    for (let i = 0; i < gameStageProps.population; i++) {
        listOfPlayerBlob[i] = <PlayerBlob key={i}
            name={'filler_name'}
            playerSpeed={gameStageProps.playerAcceleration}
            coordinates={randomSpawn()}
            area={playerStartArea}
            velocity={{ dx: 0, dy: 0 }}
            maxVelocity={maxVelocityNumerator / playerStartArea}
            color={randomRBGColor()} />;
    }

    for (let i = 0; i < gameStageProps.botPopulation; i++) {
        listOfBotBlob[i] = <PlayerBlob key={i}
            name={`bot_${i}`}
            playerSpeed={gameStageProps.playerAcceleration}
            coordinates={randomSpawn()}
            area={playerStartArea}
            velocity={{ dx: 0, dy: 0 }}
            maxVelocity={maxVelocityNumerator / playerStartArea}
            color={randomRBGColor()} />;
    }

    for (let j = 0; j < gameStageProps.food; j++) {
        listOfFood[j] = <Food key={j}
            area={foodArea}
            coordinates={randomSpawn()}
            color={randomRBGColor()} />;
    }

    // TODO: create a map instead of two coupled arrays
    for (let i = 0; i < botPopulation; i++) {
        listOfRandomCoord[i] = {
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight
        };
    }
}

const GameStage = (props) => {
    const [renderTime, setRenderTime] = useState(0);
    const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
    const [listOfRandomCoord, setRandomCoordinates] = useState([]);
    const [listOfPlayerBlob, setListOfPlayerBlob] = useState([]);
    const [listOfBotBlob, setListOfBotBlob] = useState([]);
    const [listOfFood, setListOfFood] = useState([]);

    if (listOfPlayerBlob.length === 0) {
        setUpPlayers(props,
            listOfPlayerBlob,
            listOfBotBlob,
            listOfFood,
            listOfRandomCoord);
    }

    const setMouseLastPosition = (event) => {
        setMouseCoordinates({ x: event.x, y: event.y });
    };

    useEffect(() => {
        window.addEventListener("mousemove", setMouseLastPosition);

        return () => {
            window.removeEventListener("mousemove", setMouseLastPosition);
        }
    }, [mouseCoordinates])


    // this is where all the rendering happens...
    useEffect(() => {
        moveListOfPlayerBlob();
        // TODO: figure out how to use requestAnimationFrame() here instead of setInterval()
        const interval = setInterval(() => {
            setRenderTime(renderTime + 1);
        }, 1000 / 60); // 1000 ms / 60 frames -> 62.5 ms / 1 frame


        return () => {
            clearInterval(interval);
        }
    }, [renderTime]);

    // This guy can defnitely be improved to improve performance...
    // refactoring so that there's only one list of bots
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

        // produce random movement for bots
        if (renderTime % 100 === 0) {
            for (let i = 0; i < listOfRandomCoord.length; i++) {
                newlistOfRandomCoord[i] = {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight
                };
            }
            setRandomCoordinates(newlistOfRandomCoord);
        }

        setListOfBotBlob(newListOfBotBlob);
        setListOfPlayerBlob(newListOfPLayerBlob);
    }

    const handleBotMove = (botBlob, botCoordinates, i) => {
        return blobMove(botBlob, i, botCoordinates, listOfPlayerBlob, listOfBotBlob);
    }

    const handlePlayerMove = (playerBlob, i) => {
        return blobMove(playerBlob, i, mouseCoordinates, listOfBotBlob);
    }

    const blobMove = (blob, i, moveToCoordinates, listOfAliveBlob, listOfBotBlob) => {
        let newCoordinates = {
            x: blob.props.coordinates.x,
            y: blob.props.coordinates.y
        };
        let newVelocity = {
            dx: blob.props.velocity.dx,
            dy: blob.props.velocity.dy
        };
        let newVelocityOtherBlob = { dx: 0, dy: 0 };

        let newArea = blob.props.area;
        let newPlayerSpeed = blob.props.playerSpeed;
        let newPlayerColor = blob.props.color;
        let [isColliding, FoodToRemove] = isCollidingFood(blob, listOfFood);
        if (isColliding) {
            updateFood(FoodToRemove);
            newArea += + foodArea;
            (newPlayerSpeed *= 1 / 2 < Number.MIN_VALUE ?
                newPlayerSpeed *= 1 / 2 :
                newPlayerSpeed = Number.MIN_VALUE)
        }

        [newCoordinates, newVelocity] = newPlayerCoordinates(blob.props.coordinates,
            moveToCoordinates,
            blob.props.velocity,
            playerAcceleration);

        if (listOfBotBlob !== undefined) {
            let botBlobsToCheck = listOfBotBlob.map((bot, index) => {
                if (blob === bot) {
                    // a dummy bot
                    return <PlayerBlob key={index} name={''}
                        coordinates={{ x: -50, y: -50 }}
                        playerSpeed={1}
                        area={1}
                        velocity={{ dx: 0, dy: 0 }}
                        maxVelocity={0}
                        color={'red'} />
                }
                return bot;
            });
            [newArea, newCoordinates, newPlayerColor, newVelocity] = handlePlayerCollision(blob,
                botBlobsToCheck,
                newArea,
                newCoordinates,
                newPlayerColor,
                newVelocity,
                newVelocityOtherBlob);
        }

        [newArea, newCoordinates, newPlayerColor, newVelocity] = handlePlayerCollision(blob,
            listOfAliveBlob,
            newArea,
            newCoordinates,
            newPlayerColor,
            newVelocity,
            newVelocityOtherBlob);

        newVelocity = velocityNotExceedingMax(newVelocity, blob.props.maxVelocity);
        if (newArea > maxArea) newArea = maxArea;

        return <PlayerBlob key={i}
            name={blob.props.name}
            coordinates={newCoordinates}
            playerSpeed={newPlayerSpeed}
            area={newArea}
            velocity={newVelocity}
            maxVelocity={maxVelocityNumerator / newArea}
            color={newPlayerColor} />;
    }

    const handlePlayerCollision = (blob,
        listOfAliveBlob,
        newArea,
        newCoordinates,
        newPlayerColor,
        newVelocity,
        newVelocityOtherBlob) => {
        let [isPlayerColliding, otherPlayer] = isCollidingPlayer(blob, listOfAliveBlob);
        if (isPlayerColliding) {
            if (otherPlayer.props.area > blob.props.area * consumableRatio) {
                // die, spawn again
                newArea = playerStartArea;
                newCoordinates = randomSpawn();
                newPlayerColor = randomRBGColor();
            } else if (otherPlayer.props.area * consumableRatio < blob.props.area) {
                // gain their area
                newArea += otherPlayer.props.area;
            } else {
                // perfectly elastic collision
                [newVelocity, newVelocityOtherBlob] = blobElasticCollision(blob, otherPlayer);
            }
        }
        return [newArea, newCoordinates, newPlayerColor, newVelocity];
    }

    const velocityNotExceedingMax = (velocity, maxVelocity) => {
        let xSign = Math.sign(velocity.dx);
        let ySign = Math.sign(velocity.dy);

        let dx = (Math.abs(velocity.dx) > maxVelocity ?
            maxVelocity * xSign :
            velocity.dx);
        let dy = (Math.abs(velocity.dy) > maxVelocity ?
            maxVelocity * ySign :
            velocity.dy);
        return { dx: dx, dy: dy }
    }

    const updateFood = (foodToRemove) => {
        let indexToRemove = listOfFood.findIndex(element => element === foodToRemove);
        let newListOfFood = [];
        for (let i = 0; i < listOfFood.length; i++) {
            let foodCoordinates = (i === indexToRemove ?
                randomSpawn() :
                listOfFood[i].props.coordinates);
            let foodColor = (i === indexToRemove ?
                randomRBGColor() :
                listOfFood[i].props.coordinates)
            newListOfFood[i] = <Food key={i}
                area={foodArea}
                coordinates={foodCoordinates}
                color={foodColor} />;
        }
        setListOfFood(newListOfFood);
    }

    return (
        <div>
            {listOfFood}
            {listOfPlayerBlob}
            {listOfBotBlob}
        </div>
    )
}


export default GameStage;