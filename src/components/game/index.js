import React, { useEffect, useState, useRef } from 'react';
import Game from './useGame';

export default () => {
  const canvas = useRef(null);
  const [ platforms, onPlatformsChange] = useState(1);
  const [ stars, onStarsChange] = useState(12);
  let game;

  useEffect(() => {
    game = new Game({
      canvas: canvas.current,
      stars: stars,
      onEnd: () => alert('the end')
    });
  }, [stars]);

  const onClick = () => {
    onPlatformsChange(platforms+1)
  };

  const onStart = () => {
    if (game) game.start();
  };

  const onReload = () => {
    if (game) console.log(game);
  };



  return (
    <div>
      <button onClick={onStart}>start</button>
      <button onClick={onReload}>reload</button>
      <button onClick={onClick}>add platforms</button>
      <div>
        <canvas ref={canvas}>
        </canvas>
      </div>
      <input type="number" value={stars} onChange={event => onStarsChange(event.target.value)}/>
    </div>
  )
}
