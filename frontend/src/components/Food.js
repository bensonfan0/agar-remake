import React from 'react';
import Blob from './Blob';

/**
 * DEPRECATED
 * @param {*} props 
 * @returns 
 */
const Food = (props) => {
    return (
        <Blob area={props.area} coordinates={props.coordinates} color={props.color}/>
    )
}

export default Food;