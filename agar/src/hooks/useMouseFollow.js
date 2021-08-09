import React, { useState, useEffect } from 'react';

const useMouseFollow = (acceleration, coordinates) => {
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const handleMouseMove = (event) => {
        setMousePos({ x: event.x, y: event.y });
    }

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);

        return window.removeEventListener('mousemove', handleMouseMove);
    })

    return [mousePos, setMousePos];
}

export default useMouseFollow;