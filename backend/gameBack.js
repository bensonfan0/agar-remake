/**
 * TODO: keep track of players ids
 *          - link player blob to follow only their own mouse\
 * 
 * TODO: keep track of foodblobs
 * 
 * TODO: handle interactions between players
 */

// NEED TO ADD .js TO FILE NAMES WHEN IN NODE
import { GAME_CONFIGS } from "../frontend/src/config/gameConfigs.js";
import { isCollidingBlob, newPlayerCoordinates , handlePlayerCollision, randomRBGColor, randomSpawn } from "./gameHelperBackEnd.js";

export const testFunction = () => {
    console.log('hi! from gameBack');
}

export class Game {
    // this guy has to update
    constructor() {
        this.listOfSocket = {};
        this.listOfPlayer = {};
        this.listOfFood = [];
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;

        // call this object's update() fn every 1000/60 ms
        setInterval(this.update.bind(this), 1000/60);
    }

    addPlayer = (socket, username) => {
        this.listOfSocket[socket] = username;

        this.listOfPlayer[socket.id] = {
            name : username,
            playerSpeed : GAME_CONFIGS.PLAYER_ACCELERATION,
            coordinates : randomSpawn(),
            area : GAME_CONFIGS.PLAYER_START_AREA,
            velocity : { dx: 0, dy: 0 },
            maxVelocity : GAME_CONFIGS.MAX_VELOCITY_NUMERATOR / GAME_CONFIGS.PLAYER_START_AREA,
            color : randomRBGColor()
        };

        console.log(this.listOfPlayer[socket.id].coordinates);
    }

    removePlayer = (socket) => {
        delete this.listOfSocket[socket.id];
        delete this.listOfPlayer[socket.id];
    }

    handleInput = (socket, mouseCoordinates) => {
        if (this.listOfPlayer[socket.id]) {
            
            let [newCoordinates, newVelocity] = newPlayerCoordinates(player, mouseCoordinates)

            this.listOfPlayer[socket.id].coordinates = newCoordinates;
            this.listOfPlayer[socket.id].velocity = newVelocity;
        }
    }

    update = () => {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000; // dt in seconds
        const lastUpdateTime = now;

        // add food
        for (let i = this.listOfFood.length; i < GAME_CONFIGS.FOOD_NUMBER; i++) {
            let foodState = {
                coordinates : randomSpawn(),
                color : randomRBGColor()
            }
            this.listOfFood.push(foodState);
        }
        
        
        const listOfFoodToRemove = [];
        Object.keys(this.listOfPlayer).forEach(player => {
            // food collision case
            let [isCollision, foodToRemove] = isCollidingBlob(player, this.listOfFood);
            if (isCollision) {
                listOfFoodToRemove.push(foodToRemove);
            }
            
            // player collision case -> for deaths we immediately respawn
            [isCollision, otherPlayer] = isCollidingBlob(player, this.listOfPlayer);
            if (isCollision) {
                handlePlayerCollision(player, otherPlayer);
            }
            
        });

        // destroy food
        this.listOfFood = this.listOfFood.filter(food => !listOfFoodToRemove.includes(food));
        
        // Send a game update to each player every other time (update 30 times a sec)
        if (this.shouldSendUpdate) {
            Object.keys(this.listOfSocket).forEach(playerID => {
            const socket = this.sockets[playerID];
            const player = this.players[playerID];
            // backend emits to every connected websocket
            // TODO: to make individual player windows, implementation accounts for 
            //       limited rendering 
            socket.emit(GAME_CONFIGS.SOCKET_CONSTANTS.GAME_UPDATE, this.createUpdate(player));
            });
            this.shouldSendUpdate = false;
        } else {
            this.shouldSendUpdate = true;
        } 
    }

    // we render by the whole screen 
    createUpdate(player) {
        // this is state of game
        let otherPlayers = Object.keys(this.listOfPlayer).filter( currPlayer =>
            player !== currPlayer
        );
        return {
            t: Date.now(),
            me: player,
            others: otherPlayers,
            food: this.listOfFood,
        }
    }
}