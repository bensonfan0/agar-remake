import { GAME_CONFIGS } from "../frontend/src/config/gameConfigs.js";

/**
 * helper functions used in GameStage
 */

export const randomSpawn = () => {
    let spawnCoordinates = { x: 0, y: 0 };
    // has to be a set size for map
    spawnCoordinates.x = Math.random() * GAME_CONFIGS.WINDOW_SIZE.WIDTH;
    spawnCoordinates.y = Math.random() * GAME_CONFIGS.WINDOW_SIZE.HEIGHT;
    return spawnCoordinates;
}


export const randomRBGColor = () => {
    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);
    return "rgb(" + x + "," + y + "," + z + ")";
};

// returns newCoordinates and newAcceleration
export const newPlayerCoordinates = (player, mouseCoordinates) => {
    // within range
    if (player.coordinates.x < mouseCoordinates.x + 2 && player.coordinates.x > mouseCoordinates.x - 2 && 
        player.coordinates.y < mouseCoordinates.y + 2 && player.coordinates.y > mouseCoordinates.y - 2) return (
        [player.coordinates, {dx:0,dy:0}]
    )

    let xCoordBehindMouse = mouseCoordinates.x < player.coordinates.x;
    // handle y direction acceleration
    let yCoordBelowMouse = mouseCoordinates.y < player.coordinates.y;
    let doDoubleTakeSpeed = GAME_CONFIGS.PLAYER_ACCELERATION * 8;

    if (xCoordBehindMouse) {
        if (player.velocity.dx < 0) {
            player.velocity.dx += -GAME_CONFIGS.PLAYER_ACCELERATION;
        } else {
            // accelerating wrong direction - do a double take
            player.velocity.dx += -doDoubleTakeSpeed;
        }
    } else if (!xCoordBehindMouse) {
        if (player.velocity.dx > 0) {
            player.velocity.dx += GAME_CONFIGS.PLAYER_ACCELERATION;
        } else {
            // accelerating wrong direction - do a double take
            player.velocity.dx += doDoubleTakeSpeed;
        }
    }
    if (yCoordBelowMouse) {
        if (player.velocity.dy < 0) {
            player.velocity.dy += -GAME_CONFIGS.PLAYER_ACCELERATION;
        } else {
            player.velocity.dy += -doDoubleTakeSpeed;
        }
    } else if (!yCoordBelowMouse) {
        if (player.velocity.dy > 0) {
            player.velocity.dy += GAME_CONFIGS.PLAYER_ACCELERATION;
        } else {
            player.velocity.dy += doDoubleTakeSpeed;
        }
    }

    let newCoordinates = { x: player.coordinates.x, y: player.coordinates.y };
    newCoordinates.x += player.velocity.dx;
    newCoordinates.y += player.velocity.dy;

    return [newCoordinates, player.velocity];
};


// returns [boolIfColliding, blobThatIsColliding]
export const isCollidingBlob = (blob, listOfBlob) => {
    let playerRadius = Math.sqrt(blob.area / Math.PI);
    // no need to offset radius because compensated in Blob
    let cx = blob.coordinates.x;
    let cy = blob.coordinates.y;
    
    
    for (let i = 0; i < listOfBlob.length; i++) {
        if (blob.id === listOfBlob[i].id) continue;

        let otherBlobRadius = Math.sqrt(listOfBlob[i].area / Math.PI);
        // no need to offset radius because compensated in Blob
        let cxOtherBlob = listOfBlob[i].coordinates.x;
        let cyOtherBlob = listOfBlob[i].coordinates.y;
    
        let dx = cx - cxOtherBlob;
        let dy = cy - cyOtherBlob;
        
        let cDistance = Math.sqrt(dx * dx + dy * dy);
    
        if (cDistance < playerRadius + otherBlobRadius) {
            // note: food.id is same as index of food
            return [true, listOfBlob[id]];
        }
    }
    
    return [false, null];
}

// pass by reference?
export const handlePlayerCollision = (player, otherPlayer) => {
    if (otherPlayer.area > player.area * GAME_CONFIGS.CONSUMABLE_RATIO) {
        // player die, spawn again
        player.area = GAME_CONFIGS.PLAYER_START_AREA;
        player.coordinates = randomSpawn();
        player.color = randomRBGColor();

        // otherPlayer gains mass 
        otherPlayer.area += player.area;

    } else if (otherPlayer.area * GAME_CONFIGS.CONSUMABLE_RATIO < player.areaa) {
        // otherPlayer die, spawn again
        otherPlayer.area = GAME_CONFIGS.PLAYER_START_AREA;
        otherPlayer.coordinates = randomSpawn();
        otherPlayer.color = randomRBGColor();

        // player gains area
        player.area += otherPlayer.area;
    } else {
        // perfectly elastic collision
        [playerNewVelocity, otherPlayerNewVelocity] = blobElasticCollision(player, otherPlayer);
        player.velocity = playerNewVelocity;
        otherPlayer.velocity = otherPlayerNewVelocity;
    }
}

const blobElasticCollision = (blob1, blob2) => {
    let obj1 = blob1.coordinates;
    let obj2 = blob2.coordinates;

    /**
     * v      = {dx,dy}
     * center = {x ,y}
     * m      =  area
     * 
     * velocity with two vectors {dx, dy}
     * 
     * v_1prime = v_2 - 2m_2 / (m_1 + m_2) < v_1 - v_2 , x_1 - x_2 > / || x_1 - x_2 ||^2 (x_1 - x_2)
     * 
     * refer to https://en.wikipedia.org/wiki/Elastic_collision
     * https://spicyyoghurt.com/tutorials/html5-javascript-game-development/collision-detection-physics
     */

    let newObj1Velocity = {dx:blob1.velocity.dx, dy:blob1.velocity.dy};
    let newObj2Velocity = {dx:blob2.velocity.dx, dy:blob2.velocity.dy};
    
    let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
    let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance}; // direction of travel
    let vRelativeVelocity = {x: newObj1Velocity.dx - newObj2Velocity.dx, y: newObj1Velocity.dy - newObj2Velocity.dy}; // matrix algebra
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y; // dot product
    
    if (speed < 0){
        return [newObj1Velocity, newObj2Velocity];
    }
    let impulse = 2 * speed / (blob1.area + blob2.area)

    newObj1Velocity.dx -= (impulse * blob2.area * vCollisionNorm.x);
    newObj1Velocity.dy -= (impulse * blob2.area * vCollisionNorm.y);
    newObj2Velocity.dx += (impulse * blob1.area * vCollisionNorm.x);
    newObj2Velocity.dy += (impulse * blob1.area * vCollisionNorm.y);

    return [newObj1Velocity, newObj2Velocity];
}