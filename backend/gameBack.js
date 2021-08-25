/**
 * TODO: keep track of players ids
 *          - link player blob to follow only their own mouse\
 * 
 * TODO: keep track of foodblobs
 * 
 * TODO: handle interactions between players
 */
import { GAME_CONFIGS } from "../frontend/src/config/gameConfigs";
import { isCollidingBlob, handlePlayerCollision } from "./gameHelperBackEnd";

export class game {
    // this guy has to update
    constructor() {
        this.listOfSocket = {};
        this.listOfPlayer = {};
        this.listOfFood = [];
        this.lastUpdateTime = Date.now();
        
        // call this object's update() fn every 1000/60 ms
        setInterval(this.update.bind(this), 1000/60);
    }



    addPlayer = (socket, username) => {
    }

    removePlayer = (socket) => {
    }

    update = () => {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000; // dt in seconds
        const lastUpdateTime = now;

        const listOfFoodToRemove = [];
        this.listOfPlayer.forEach(player => {
            // food collision case
            let [isCollision, foodToRemove] = isCollidingBlob(player, this.listOfFood);
            if (isCollision) {
                listOfFoodToRemove.push(foodToRemove);
            }

            
            // player collision case
            let [newArea, newCoordinates, newPlayerColor, newVelocity] = handlePlayerCollision(player, this.listOfPlayer);




        })


    }

}