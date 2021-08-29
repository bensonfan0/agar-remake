import express from 'express';
import { Server } from 'socket.io';
import { Game } from './gameBack.js';
import { GAME_CONFIGS } from '../frontend/src/config/gameConfigs.js';
import http from 'http';

// need to add .js to end of path when using express & node

const app = express(); 

const port = process.env.PORT || 3000; 

app.use(express.static('./frontend/build'));

// Setup socket.io
const server = http.createServer(app);
const io = new Server(server);

let incrementMe = 0;
setInterval(() => {
  app.get("/api", (req, res) => {
    res.json({ message: `Hello from server! count: ${incrementMe}` });
  });
  incrementMe++;
}, 500);


io.on('connection', (socket) => {
  console.log('SOCKET.IO working -> a user connected with id: ' + socket.id);

  socket.on(GAME_CONFIGS.SOCKET_CONSTANTS.JOIN_GAME, joinGame);
  socket.on(GAME_CONFIGS.SOCKET_CONSTANTS.INPUT, handleInput)
  socket.on('disconnect', onDisconnect);
})

server.listen(port, () => {
  console.log(`Server listening on ${port}`)
})

// Setup the Game
const game = new Game();

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function onDisconnect() {
  console.log('player Disconnected')
  game.removePlayer(this);
}