export const randomRBGColor = () => {
    let x = Math.floor(Math.random() * 256);
    let y = Math.floor(Math.random() * 256);
    let z = Math.floor(Math.random() * 256);
    return "rgb(" + x + "," + y + "," + z + ")";
}

export const moveListOfPlayerBlob = (listOfPlayerBlob, mouseLastCoordinates) => {
    for (let i = 0; i < listOfPlayerBlob.length; i++) {
        movePlayerBlob(listOfPlayerBlob[i], mouseLastCoordinates);
    }
}

const movePlayerBlob = (playerBlob, mouseLastCoordinates) => {
    // TODO: instead of rendering the blob here, we can have the helper check function
    // and call it elsewhere?
    // but the problem is that the isCollision needs the listOfThings
    <playerBlob coordinates={mouseLastCoordinates}/>
    console.log("this is playerBlob: ", playerBlob/ "this is mouseLastCoordinates: ", mouseLastCoordinates);
}

const isCollision = (listOfFood, listOfPlayerBlob) => {
    // measure using radius of circle and if moving forward then remove food and
    // increase player
    /**
     * 
     */
}