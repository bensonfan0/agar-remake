import React from 'react';
import Blob from './Blob';
import { randomRBGColor } from '../GameHelper';


const Food = (props) => {

    return (
        <Blob area={props.area} coordinates={props.coordinates} color={props.color}/>
    )
}

export default Food;