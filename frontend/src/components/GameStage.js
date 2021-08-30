import React, { useState, useEffect } from 'react';
import {
    isCollidingPlayer,
    isCollidingFood,
    newPlayerCoordinates,
    randomRBGColor,
    blobElasticCollision
} from '../gameHelperFrontEnd';
import PlayerBlob from './playerBlob';
import Food from './food';
import Blob from './blob';
import {
    GAME_CONFIGS
} from '../config/gameConfigs';
import { getCurrentState } from '../networking/state';

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
    for (let i = 0; i < GAME_CONFIGS.PLAYER_POPULATION; i++) {
        listOfPlayerBlob[i] = <PlayerBlob key={i}
            name={'filler_name'}
            playerSpeed={GAME_CONFIGS.PLAYER_ACCELERATION}
            coordinates={randomSpawn()}
            area={GAME_CONFIGS.PLAYER_START_AREA}
            velocity={{ dx: 0, dy: 0 }}
            maxVelocity={GAME_CONFIGS.MAX_VELOCITY_NUMERATOR / GAME_CONFIGS.PLAYER_START_AREA}
            color={randomRBGColor()} />;
    }

    for (let i = 0; i < GAME_CONFIGS.BOT_POPULATION; i++) {
        listOfBotBlob[i] = <PlayerBlob key={i}
            name={`bot_${i}`}
            playerSpeed={GAME_CONFIGS.PLAYER_ACCELERATION}
            coordinates={randomSpawn()}
            area={GAME_CONFIGS.PLAYER_START_AREA}
            velocity={{ dx: 0, dy: 0 }}
            maxVelocity={GAME_CONFIGS.MAX_VELOCITY_NUMERATOR / GAME_CONFIGS.PLAYER_START_AREA}
            color={randomRBGColor()} />;
    }

    for (let j = 0; j < GAME_CONFIGS.FOOD_NUMBER; j++) {
        listOfFood[j] = <Food key={j}
            area={GAME_CONFIGS.FOOD_AREA}
            coordinates={randomSpawn()}
            color={randomRBGColor()} />;
    }

    // TODO: create a map instead of two coupled arrays
    for (let i = 0; i < GAME_CONFIGS.BOT_POPULATION; i++) {
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

    // this is where all the rendering happens...
    useEffect(() => {
        const interval = setInterval(() => {
            // TODO: update game state here
            setRenderTime(renderTime + 1);
            updateGameStage();
        }, 1000 / 60); // 1000 ms / 60 frames -> 62.5 ms / 1 frame
        
        
        return () => {
            clearInterval(interval);
        }
    }, [renderTime]);
    
    const updateGameStage = () => {
        // state returned is {food, me, others}
        let currentState = getCurrentState();

        //console.log('this here is current state: ', currentState)

        let newListOfPlayerBlob = [];
        let newListOfFood = [];

        newListOfPlayerBlob.push(createPlayerBlob(currentState.me));
        currentState.others.forEach((otherPlayer) =>
            newListOfPlayerBlob.push(createPlayerBlob(otherPlayer))
        );

        currentState.food.forEach(food => {
            newListOfFood.push(createFoodBlob(food))
        })

        setListOfPlayerBlob(newListOfPlayerBlob);
        setListOfFood(newListOfFood);
    }

    useEffect(() => {

    }, [listOfFood, listOfPlayerBlob])


    const createPlayerBlob = (player) => {
        return <PlayerBlob key={player.id} 
            name={player.name}
            coordinates={player.coordinates}
            area={player.area}
            color={player.color} 
        />
    }

    const createFoodBlob = (food) => {
        return <Blob key={food.id}
            coordinates={food.coordinates}
            color={food.color}
            area={food.area}
        />
    }

    return (
        <div>
            {listOfFood}
            {listOfPlayerBlob}
        </div>
    )

    

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
        const interval = setInterval(() => {
            // TODO: update game state here
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
            newArea += + GAME_CONFIGS.FOOD_AREA;
            (newPlayerSpeed *= 1 / 2 < Number.MIN_VALUE ?
                newPlayerSpeed *= 1 / 2 :
                newPlayerSpeed = Number.MIN_VALUE)
        }

        [newCoordinates, newVelocity] = newPlayerCoordinates(blob.props.coordinates,
            moveToCoordinates,
            blob.props.velocity,
            GAME_CONFIGS.PLAYER_ACCELERATION);

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
        if (newArea > GAME_CONFIGS.MAX_AREA) newArea = GAME_CONFIGS.MAX_AREA;

        return <PlayerBlob key={i}
            name={blob.props.name}
            coordinates={newCoordinates}
            playerSpeed={newPlayerSpeed}
            area={newArea}
            velocity={newVelocity}
            maxVelocity={GAME_CONFIGS.MAX_VELOCITY_NUMERATOR / newArea}
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
            if (otherPlayer.props.area > blob.props.area * GAME_CONFIGS.CONSUMABLE_RATIO) {
                // die, spawn again
                newArea = GAME_CONFIGS.PLAYER_START_AREA;
                newCoordinates = randomSpawn();
                newPlayerColor = randomRBGColor();
            } else if (otherPlayer.props.area * GAME_CONFIGS.CONSUMABLE_RATIO < blob.props.area) {
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
                area={GAME_CONFIGS.FOOD_AREA}
                coordinates={foodCoordinates}
                color={foodColor} />;
        }
        setListOfFood(newListOfFood);
    }

    // return (
    //     <div>
    //         {listOfFood}
    //         {listOfPlayerBlob}
    //         {listOfBotBlob}
    //     </div>
    // )
}


export default GameStage;
