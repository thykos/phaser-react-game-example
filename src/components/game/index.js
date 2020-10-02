import React, { useEffect, useState, useRef } from 'react';
import Game from './useGame';

export default () => {
  const canvas = useRef(null);
  const [ status, onStatusChange ] = useState('greetings');
  let game;

  useEffect(() => {
    if (status === 'game') {
      game = new Game({
        canvas: canvas.current,
        stars: 12,
        width: 800,
        height: 600,
        onLoose: () => onStatusChange('loose'),
        onWin: () => onStatusChange('win'),
        scoreToWin: 600,
        scorePerStar: 30,
        fontColor: '#fff',
        fontFamily: 'Roboto',
        assets: {
          sky: 'assets/sky.png',
          ground: 'assets/platform.png',
          star: 'assets/star.png',
          bomb: 'assets/bomb.png'
        }
      });
    }
  }, [status]);


  const onStart = () => {
    onStatusChange('game');
  };

  return (
    <div>
      {status === 'greetings' ?
        <div>
          <div>Welcome to the game</div>
          <div>You need to collect 600 points and don't touch any bombs</div>
          <button onClick={onStart}>start</button>
        </div>
        : null}
      {status === 'game'? <div>
        <canvas ref={canvas} />
        </div> : null}
      {status === 'loose' ? <div>you are loose</div> : null}
      {status === 'win' ? <div>you are win</div> : null}
    </div>
  )
}
