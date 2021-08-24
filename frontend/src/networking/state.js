/**
 * What shall the front-end need to generate a new frame?
 *      1. listOfFood {color, position}
 *      2. listOfPlayer {color, size, position, speed}
 */

// The "current" state will always be RENDER_DELAY ms behind server time.
// This makes gameplay smoother and lag less noticeable.
const RENDER_DELAY = 100;

const gameUpdates = [];
let gameStart = 0;
let firstServerTimestamp = 0;


export const initState = () => {
    
}

// Returns { me, others, food }
export const getCurrentState = () => {

}

export const processGameState = (gameState) => {
    if (!firstServerTimestamp) {
        firstServerTimestamp = gameState.t;
        gameStart = Date.now();
      }
      gameUpdates.push(gameState);
    
      // Keep only one game update before the current server time
      const base = getBaseUpdate();
      if (base > 0) {
        gameUpdates.splice(0, base);
      }
}

// Returns the index of the base update, the first game update before
// current server time, or -1 if N/A.
function getBaseUpdate() {
    const serverTime = currentServerTime();
    for (let i = gameUpdates.length - 1; i >= 0; i--) {
        if (gameUpdates[i].t <= serverTime) {
        return i;
        }
    }
    return -1;
}

function currentServerTime() {
    // time is delayed to account for ping
    return firstServerTimestamp + (Date.now() - gameStart) - RENDER_DELAY;
}
  

// TODO: interpolate to create smooth movement