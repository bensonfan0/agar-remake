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
import { isCollidingFood, isCollidingPlayer, newPlayerCoordinates , handlePlayerCollision, randomRBGColor, randomSpawn } from "./gameHelperBackEnd.js";

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
            color : randomRBGColor(),
            mouseCoordinates: {x:0, y:0}
        };

    }

    removePlayer = (socket) => {
        delete this.objectOfSockets[socket.id];
        delete this.objectOfPlayers[socket.id];
    }

    handleInput = (socket, mouseCoordinates) => {
        //console.log('handleInput', mouseCoordinates);
        if (this.objectOfPlayers[socket.id]) {
            this.objectOfPlayers[socket.id].mouseCoordinates = mouseCoordinates;
            // let [newCoordinates, newVelocity] = newPlayerCoordinates(this.objectOfPlayers[socket.id], mouseCoordinates)

            // this.objectOfPlayers[socket.id].coordinates = newCoordinates;
            // this.objectOfPlayers[socket.id].velocity = newVelocity;
        }
    }

    update = () => {
        //console.log('update being called');
        const now = Date.now();
        const dt = (now - this.lastUpdateTime) / 1000; // dt in seconds
        const lastUpdateTime = now;

        // add food 
        for (let i = this.listOfFood.length; i < GAME_CONFIGS.FOOD_NUMBER; i++) {
            let foodState = {
                id : i,
                coordinates : randomSpawn(),
                color : randomRBGColor(),
                area : GAME_CONFIGS.FOOD_AREA
            }
            this.listOfFood.push(foodState);
        }
        
        
        const listOfFoodToRemove = [];
        for (const [key, currPlayer] of Object.entries(this.objectOfPlayers)) {
            
            
            // food collision case
            let [isCollision, foodToRemoveID] = isCollidingFood(currPlayer, this.listOfFood);
            if (isCollision) {
                console.log('do i ever collide with food?');
                currPlayer.area += GAME_CONFIGS.FOOD_AREA;
                listOfFoodToRemove.push(foodToRemoveID);
            }
            
            // player collision case -> for deaths we immediately respawn
            let [isPlayerColliding, otherPlayerID] = isCollidingPlayer(currPlayer, this.objectOfPlayers);
            //console.log(isPlayerColliding);
            //console.log(otherPlayerID);
            
            if (isPlayerColliding) {
                console.log('do i ever collide with players?');
                handlePlayerCollision(currPlayer,
                    this.objectOfPlayers[otherPlayerID]);
                }

                
            let [newCoordinates, newVelocity] = newPlayerCoordinates(currPlayer);
            currPlayer.coordinates = newCoordinates;
            currPlayer.velocity = newVelocity;
        }

        // destroy food -> we are reassigning ids here (probably poor practice)
        let prevIndex = 0;
        this.listOfFood = this.listOfFood.filter((food, index) => {
            let isKeep = !listOfFoodToRemove.includes(food);
            // keep track of previous index 
            if (isKeep) {
                food.id = prevIndex;
                prevIndex = index;
            }

            return isKeep;
            });

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