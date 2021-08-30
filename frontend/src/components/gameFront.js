import React, { useState, useEffect } from 'react';
import GameStage from './gameStage';
import { updateDirection, connect, play } from '../networking/networking';

const GameFront = () => {
    // TODO: screen moves with coordinates 
    // TODO: able to 'shoot' half blob forward
    const [mouseCoordinates, setMouseCoordinates] = useState({ x: 0, y: 0 });
    const [username, setUsername] = useState('');

    const [showStartMenu, setShowStartMenu] = useState(true);

    useEffect(() => {
        window.addEventListener("mousemove", handleMouseMove);
        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
        }
    }, [mouseCoordinates]);

    const handleMouseMove = (e) => {
        setMouseCoordinates({x:e.x, y:e.y});
        updateDirection(e);
    }

    const handleSubmit = () => {
        Promise.all([connect("connecting...")])
        .then(() => {
        play(username);
        setTimeout(setShowStartMenu(false), 1000);
        })
        .catch(err => console.log(err));
    }

    return (
        <div>
            { showStartMenu ? 
            <div className='start-menu'>
                <p className='welcome-start-menu'>
                    WELCOME TO A BOOTLEG AGAR.IO!
                </p>
                <input type="text" placeholder="Enter Username" name="uname" required onChange={(e) => {
                    setUsername(e.target.value);
                }}/>
                <input type="submit" value="Play!" onClick={handleSubmit}/>
            </div> 
                : <GameStage /> }
        </div>
    )
}

export default GameFront;