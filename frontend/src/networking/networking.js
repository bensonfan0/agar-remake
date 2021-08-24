import io from 'socket.io-client';

/**
 * Note: socket.on(MESSAGE, callbackfn(parameter1, parameter2, ...)) 
 *      - on() will handle event sent with emit()
 * 
 * when socket.emit(MESSAGE, parameter1, parameter2, ...)  
 */

const socketProtocol = (window.location.protocol.includes('https')) ? 'wss' : 'ws';
const socket = io(`${socketProtocol}://${window.location.host}`, { reconnection: false });

const connectedPromise = new Promise((resolve, reject) => {
    //console.log('new promise created 2', socket);
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
    //console.log('new promise created 1', socket);
    connectedPromise.then(() => {
        //console.log('connected we did it');
    }).catch(reject => {
        console.log(reject.message, reject.socket);
    })
}