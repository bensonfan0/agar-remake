import { GAME_CONFIGS } from "../frontend/src/config/gameConfigs";

/**
 * helper functions used in GameStage
 */


export const randomRBGColor = () => {
    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);
    return "rgb(" + x + "," + y + "," + z + ")";
};

// returns newCoordinates and newAcceleration
export const newPlayerCoordinates = (playerCoordinates, mouseCoordinates, playerVelocity, gameAcceleration) => {
    // within range
    if (playerCoordinates.x < mouseCoordinates.x + 2 && playerCoordinates.x > mouseCoordinates.x - 2 && 
        playerCoordinates.y < mouseCoordinates.y + 2 && playerCoordinates.y > mouseCoordinates.y - 2) return (
        [playerCoordinates, {dx:0,dy:0}]
    )

    let xCoordBehindMouse = mouseCoordinates.x < playerCoordinates.x;
    // handle y direction acceleration
    let yCoordBelowMouse = mouseCoordinates.y < playerCoordinates.y;
    let doDoubleTakeSpeed = gameAcceleration * 8;

    if (xCoordBehindMouse) {
        if (playerVelocity.dx < 0) {
            playerVelocity.dx += -gameAcceleration;
        } else {
            // accelerating wrong direction - do a double take
            playerVelocity.dx += -doDoubleTakeSpeed;
        }
    } else if (!xCoordBehindMouse) {
        if (playerVelocity.dx > 0) {
            playerVelocity.dx += gameAcceleration;
        } else {
            // accelerating wrong direction - do a double take
            playerVelocity.dx += doDoubleTakeSpeed;
        }
    }
    if (yCoordBelowMouse) {
        if (playerVelocity.dy < 0) {
            playerVelocity.dy += -gameAcceleration;
        } else {
            playerVelocity.dy += -doDoubleTakeSpeed;
        }
    } else if (!yCoordBelowMouse) {
        if (playerVelocity.dy > 0) {
            playerVelocity.dy += gameAcceleration;
        } else {
            playerVelocity.dy += doDoubleTakeSpeed;
        }
    }

    let newCoordinates = { x: playerCoordinates.x, y: playerCoordinates.y };
    newCoordinates.x += playerVelocity.dx;
    newCoordinates.y += playerVelocity.dy;

    return [newCoordinates, playerVelocity];
};



export const isCollidingBlob = (blob, listOfBlob) => {
    let playerRadius = Math.sqrt(blob.props.area / Math.PI);
    // no need to offset radius because compensated in Blob
    let cx = blob.props.coordinates.x;
    let cy = blob.props.coordinates.y;
    
    
    for (let i = 0; i < listOfBlob.length; i++) {
        let otherBlobRadius = Math.sqrt(listOfBlob[i].props.area / Math.PI);
        // no need to offset radius because compensated in Blob
        let cxOtherBlob = listOfBlob[i].props.coordinates.x;
        let cyOtherBlob = listOfBlob[i].props.coordinates.y;
    
        let dx = cx - cxOtherBlob;
        let dy = cy - cyOtherBlob;
        
        let cDistance = Math.sqrt(dx * dx + dy * dy);
    
        if (cDistance < playerRadius + otherBlobRadius) {
            return [true, listOfBlob[i]];
        }
    }
    
    return [false, null];
}

export const handlePlayerCollision = (blob,
    listOfAliveBlob,
    newArea,
    newCoordinates,
    newPlayerColor,
    newVelocity,
    newVelocityOtherBlob) => {
    let [isPlayerColliding, otherPlayer] = isCollidingPlayer(blob, listOfAliveBlob);
    if (isPlayerColliding) {
        if (otherPlayer.props.area > blob.props.area * GAME_CONFIGS.CONSUMABLE_RATIO) {
            // die, spawn again
            newArea = GAME_CONFIGS.PLAYER_START_AREA;
            newCoordinates = randomSpawn();
            newPlayerColor = randomRBGColor();
        } else if (otherPlayer.props.area * GAME_CONFIGS.CONSUMABLE_RATIO < blob.props.area) {
            // gain their area
            newArea += otherPlayer.props.area;
        } else {
            // perfectly elastic collision
            [newVelocity, newVelocityOtherBlob] = blobElasticCollision(blob, otherPlayer);
        }
    }
    return [newArea, newCoordinates, newPlayerColor, newVelocity];
}

const blobElasticCollision = (blob1, blob2) => {
    let obj1 = blob1.props.coordinates;
    let obj2 = blob2.props.coordinates;

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

    let newObj1Velocity = {dx:blob1.props.velocity.dx, dy:blob1.props.velocity.dy};
    let newObj2Velocity = {dx:blob2.props.velocity.dx, dy:blob2.props.velocity.dy};
    
    let vCollision = {x: obj2.x - obj1.x, y: obj2.y - obj1.y};
    let distance = Math.sqrt((obj2.x-obj1.x)*(obj2.x-obj1.x) + (obj2.y-obj1.y)*(obj2.y-obj1.y));
    let vCollisionNorm = {x: vCollision.x / distance, y: vCollision.y / distance}; // direction of travel
    let vRelativeVelocity = {x: newObj1Velocity.dx - newObj2Velocity.dx, y: newObj1Velocity.dy - newObj2Velocity.dy}; // matrix algebra
    let speed = vRelativeVelocity.x * vCollisionNorm.x + vRelativeVelocity.y * vCollisionNorm.y; // dot product
    
    if (speed < 0){
        return [newObj1Velocity, newObj2Velocity];
    }
    let impulse = 2 * speed / (blob1.props.area + blob2.props.area)

    newObj1Velocity.dx -= (impulse * blob2.props.area * vCollisionNorm.x);
    newObj1Velocity.dy -= (impulse * blob2.props.area * vCollisionNorm.y);
    newObj2Velocity.dx += (impulse * blob1.props.area * vCollisionNorm.x);
    newObj2Velocity.dy += (impulse * blob1.props.area * vCollisionNorm.y);

    return [newObj1Velocity, newObj2Velocity];
}