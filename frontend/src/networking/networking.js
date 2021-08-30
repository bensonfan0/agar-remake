import io from 'socket.io-client';
import { GAME_CONFIGS } from '../config/gameConfigs';
import { processGameState } from './state';

/**
 * Note: socket.on(MESSAGE, callbackfn(parameter1, parameter2, ...)) 
 *      - on() will handle event sent with emit()
 * 
 * when socket.emit(MESSAGE, parameter1, parameter2, ...)  
 */

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const connectedPromise = new Promise((resolve, reject) => {
    socket.on('connect', () => {
        console.log('We got in!', socket);
        resolve();
    });
    socket.on("connect_error", (err) => {
        reject({message:`connect_error due to ${err.message} `, socket:socket});
    });

    setTimeout(() => reject('FAILURE'), 100000);
})

export const connect = (sentence) => {
    console.log(sentence);
    connectedPromise.then(() => {
        // handle socket emits from backend
        socket.on(GAME_CONFIGS.SOCKET_CONSTANTS.GAME_UPDATE, processGameState);
    }).catch(reject => {
        console.log(reject.message, reject.socket);
    })
}

export const play = username => {
    socket.emit(GAME_CONFIGS.SOCKET_CONSTANTS.JOIN_GAME, username);
}

export const updateDirection = (mouseCoordinates) => {
    socket.emit(GAME_CONFIGS.SOCKET_CONSTANTS.INPUT, {x:mouseCoordinates.x, y:mouseCoordinates.y});
}