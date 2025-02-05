import { useEffect, useRef } from 'react';
import { Player } from '@lordicon/react';

const ICON = require('../assets/folder.json');

export default function PlayOnce() {    
  const playerRef = useRef(null);
  
    useEffect(() => {
        playerRef.current?.playFromBeginning();
    }, [])

    return (
        <Player 
            ref={playerRef} 
            icon={ ICON }
            size={80}
        />
    );
}