import React, { useState, useEffect } from 'react';
import PlayerBlob from './playerBlob';
import Blob from './blob';
import { getCurrentState } from '../networking/state';

const GameStage = (props) => {
    const [renderTime, setRenderTime] = useState(0);
    const [listOfPlayerBlob, setListOfPlayerBlob] = useState([]);
    const [listOfFood, setListOfFood] = useState([]);

    // RENDER
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

        let newListOfPlayerBlob = [];
        let newListOfFood = [];

        if (currentState.me !== undefined) {
            newListOfPlayerBlob.push(createPlayerBlob(currentState.me));
        }

        if (currentState.others !== undefined) {
            currentState.others.forEach((otherPlayer) =>
                newListOfPlayerBlob.push(createPlayerBlob(otherPlayer))
            );
        }

        currentState.food.forEach(food => {
            newListOfFood.push(createFoodBlob(food))
        })

        setListOfPlayerBlob(newListOfPlayerBlob);
        setListOfFood(newListOfFood);
    }

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
}


export default GameStage;
