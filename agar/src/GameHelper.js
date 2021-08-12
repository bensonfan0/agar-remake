export const randomRBGColor = () => {
    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);
    return "rgb(" + x + "," + y + "," + z + ")";
};

// returns newCoordinates and newAcceleration
export const newPlayerCoordinates = (playerCoordinates, mouseCoordinates, playerAcceleration, gameAcceleration) => {
    // within range
    if (playerCoordinates.x < mouseCoordinates.x + 2 && playerCoordinates.x > mouseCoordinates.x - 2 && 
        playerCoordinates.y < mouseCoordinates.y + 2 && playerCoordinates.y > mouseCoordinates.y - 2) return (
        [playerCoordinates, {dx:0,dy:0}]
    )

    let xCoordBehindMouse = mouseCoordinates.x < playerCoordinates.x;
    // handle y direction acceleration
    let yCoordBelowMouse = mouseCoordinates.y < playerCoordinates.y;
    let doDoubleTakeSpeed = gameAcceleration * 6;

    if (xCoordBehindMouse) {
        if (playerAcceleration.dx < 0) {
            playerAcceleration.dx += -gameAcceleration;
        } else {
            // accelerating wrong direction - do a double take
            playerAcceleration.dx += -doDoubleTakeSpeed;
        }
    } else if (!xCoordBehindMouse) {
        if (playerAcceleration.dx > 0) {
            playerAcceleration.dx += gameAcceleration;
        } else {
            // accelerating wrong direction - do a double take
            playerAcceleration.dx += doDoubleTakeSpeed;
        }
    }
    if (yCoordBelowMouse) {
        if (playerAcceleration.dy < 0) {
            playerAcceleration.dy += -gameAcceleration;
        } else {
            playerAcceleration.dy += -doDoubleTakeSpeed;
        }
    } else if (!yCoordBelowMouse) {
        if (playerAcceleration.dy > 0) {
            playerAcceleration.dy += gameAcceleration;
        } else {
            playerAcceleration.dy += doDoubleTakeSpeed;
        }
    }

    // update coordinates
    let newCoordinates = { x: playerCoordinates.x, y: playerCoordinates.y };
    newCoordinates.x += playerAcceleration.dx;
    newCoordinates.y += playerAcceleration.dy;

    return [newCoordinates, playerAcceleration];
};

export const newBotCoordinates = (playerCoordinates, randomCoordinates, playerAcceleration, gameAcceleration) => {
    // within range
    if (playerCoordinates.x < randomCoordinates.x + 2 && playerCoordinates.x > randomCoordinates.x - 2 && 
        playerCoordinates.y < randomCoordinates.y + 2 && playerCoordinates.y > randomCoordinates.y - 2) return (
        [playerCoordinates, {dx:0,dy:0}]
    )

    let xCoordBehindMouse = randomCoordinates.x < playerCoordinates.x;
    // handle y direction acceleration
    let yCoordBelowMouse = randomCoordinates.y < playerCoordinates.y;
    let doDoubleTakeSpeed = gameAcceleration * 6;

    if (xCoordBehindMouse) {
        if (playerAcceleration.dx < 0) {
            playerAcceleration.dx += -gameAcceleration;
        } else {
            // accelerating wrong direction - do a double take
            playerAcceleration.dx += -doDoubleTakeSpeed;
        }
    } else if (!xCoordBehindMouse) {
        if (playerAcceleration.dx > 0) {
            playerAcceleration.dx += gameAcceleration;
        } else {
            // accelerating wrong direction - do a double take
            playerAcceleration.dx += doDoubleTakeSpeed;
        }
    }
    if (yCoordBelowMouse) {
        if (playerAcceleration.dy < 0) {
            playerAcceleration.dy += -gameAcceleration;
        } else {
            playerAcceleration.dy += -doDoubleTakeSpeed;
        }
    } else if (!yCoordBelowMouse) {
        if (playerAcceleration.dy > 0) {
            playerAcceleration.dy += gameAcceleration;
        } else {
            playerAcceleration.dy += doDoubleTakeSpeed;
        }
    }

    // update coordinates
    let newCoordinates = { x: playerCoordinates.x, y: playerCoordinates.y };
    newCoordinates.x += playerAcceleration.dx;
    newCoordinates.y += playerAcceleration.dy;

    return [newCoordinates, playerAcceleration];
}

export const isCollidingFood = (playerBlob, listOfFood) => {
    // check if colliding with food
    //console.log("helper function this is playerBlob", playerBlob);
    let playerRadius = (playerBlob.props.size / 2);

    // let cx = playerBlob.props.coordinates.x + playerRadius;
    // let cy = playerBlob.props.coordinates.y + playerRadius;
    
    // no need to offset radius because compensated in Blob
    let cx = playerBlob.props.coordinates.x;
    let cy = playerBlob.props.coordinates.y;

    
    for (let i = 0; i < listOfFood.length; i++) {
        let foodRadius = (listOfFood[i].props.size / 2);
        // let cxFood = listOfFood[i].props.coordinates.x + foodRadius;
        // let cyFood = listOfFood[i].props.coordinates.y + foodRadius;

        // no need to offset radius because compensated in Blob
        let cxFood = listOfFood[i].props.coordinates.x;
        let cyFood = listOfFood[i].props.coordinates.y;

        let dx = cx - cxFood;
        let dy = cy - cyFood;
        
        let cDistance = Math.sqrt(dx * dx + dy * dy);

        //console.log("this is food", listOfFood[i]);
        //console.log("cx:", cx, "cy:", cy);
        //console.log("cxFood:", cxFood, "cyFood:", cyFood);
        //console.log("cDistance:", cDistance);
        if (cDistance < playerRadius + foodRadius) {
            console.log("collision detected!", listOfFood[i]);
            return [true, listOfFood[i]];
        }
    }

    return [false, null];
};

export const isCollidingPlayer = (playerBlob, listOfPlayerBlob) => {
    // check if colliding with another player

    return true;
};
