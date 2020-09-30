import React, { useEffect, useState, useRef } from 'react';
import Phaser from 'phaser';
import Game from './useGame';

export default () => {
  const canvas = useRef(null);
  const [ platforms, onPlatformsChange] = useState(1);


  useEffect(() => {
    const game = new Game({
      type: Phaser.CANVAS,
      width: 800,
      height: 600,
      canvas: canvas.current
    });
    game.onStart();
  }, []);

  const onClick = () => {
    onPlatformsChange(platforms+1)
  };


  return (
    <div>
      <button onClick={onClick}>add platforms</button>
      <div>
        <canvas ref={canvas}>
        </canvas>
      </div>
    </div>
  )
}
