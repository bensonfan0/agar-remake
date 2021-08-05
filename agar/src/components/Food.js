import React from 'react';
import Blob from './Blob';

const Food = (prop) => {

    let FoodSize = 15;

    return (
        <Blob isPlayer={false} size={FoodSize}/>
    )
}

export default Food;