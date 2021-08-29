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
        this.objectOfSockets = {};
        this.objectOfPlayers = {};
        this.listOfFood = [];
        this.lastUpdateTime = Date.now();
        this.shouldSendUpdate = false;

        // call this object's update() fn every 1000/60 ms
        setInterval(this.update.bind(this), 1000/60);
    }

    addPlayer = (socket, username) => {
        console.log('socket is this', socket);
        console.log('username is this', username);
        this.objectOfSockets[socket.id] = socket;

        this.objectOfPlayers[socket.id] = {
            id : socket.id,
            name : username,
            playerSpeed : GAME_CONFIGS.PLAYER_ACCELERATION,
            coordinates : randomSpawn(),
            area : GAME_CONFIGS.PLAYER_START_AREA,
            velocity : { dx: 0, dy: 0 },
            maxVelocity : GAME_CONFIGS.MAX_VELOCITY_NUMERATOR / GAME_CONFIGS.PLAYER_START_AREA,
            color : randomRBGColor()
        };

    }

    removePlayer = (socket) => {
        delete this.objectOfSockets[socket.id];
        delete this.objectOfPlayers[socket.id];
    }

    handleInput = (socket, mouseCoordinates) => {
        if (this.objectOfPlayers[socket.id]) {
            
            let [newCoordinates, newVelocity] = newPlayerCoordinates(this.objectOfPlayers[socket.id], mouseCoordinates)

            this.objectOfPlayers[socket.id].coordinates = newCoordinates;
            this.objectOfPlayers[socket.id].velocity = newVelocity;
        }
    }

    update = () => {
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000; // dt in seconds
        const lastUpdateTime = now;

        // add food
        for (let i = this.listOfFood.length - 1; i < GAME_CONFIGS.FOOD_NUMBER; i++) {
            let foodState = {
                id : i,
                coordinates : randomSpawn(),
                color : randomRBGColor()
            }
            this.listOfFood.push(foodState);
        }
        
        
        const listOfFoodToRemove = [];
        Object.keys(this.objectOfPlayers).forEach(playerID => {
            // food collision case
            let [isCollision, foodToRemoveID] = isCollidingBlob(this.objectOfPlayers[playerID], this.listOfFood);
            if (isCollision) {
                listOfFoodToRemove.push(this.listOfFood[foodToRemoveID]);
            }
            
            // player collision case -> for deaths we immediately respawn
            let otherPlayerID = null;
            [isCollision, otherPlayerID] = isCollidingBlob(this.objectOfPlayers[playerID], this.objectOfPlayers);
            if (isCollision) {
                handlePlayerCollision(this.objectOfPlayers[playerID],
                    this.objectOfPlayers[otherPlayerID]);
            }
            
        });

        // destroy food
        this.listOfFood = this.listOfFood.filter(food => !listOfFoodToRemove.includes(food));
        
        // Send a game update to each player every other time (update 30 times a sec)
        if (this.shouldSendUpdate) {
            Object.keys(this.objectOfSockets).forEach(socketID => {
            const socket = this.objectOfSockets[socketID];
            const player = this.objectOfPlayers[socketID];
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
        let objectOfOtherPlayersID = Object.keys(this.objectOfPlayers).filter( 
            currPlayerID => player.id !== currPlayerID
        );
        //console.log(objectOfOtherPlayersID);
        return {
            t: Date.now(),
            me: player,
            others: objectOfOtherPlayersID.map(otherPlayersId => (this.objectOfPlayers[otherPlayersId])),
            food: this.listOfFood,
        }
    }
}