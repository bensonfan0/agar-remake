import express from 'express';

const app = express(); 
const port = process.env.PORT || 3000; 

app.use(express.static('./front-end/build'));


let incrementMe = 0;
setInterval(() => {
  app.get("/api", (req, res) => {
    res.json({ message: `Hello from server! count: ${incrementMe}` });
  });
  incrementMe++;
}, 500);
  
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});



// Setup the Game
const game = {};

function joinGame(username) {
  game.addPlayer(this, username);
}

function handleInput(dir) {
  game.handleInput(this, dir);
}

function onDisconnect() {
  game.removePlayer(this);
}