import React, { useEffect, useState, useRef } from 'react';
import Game from './useGame';

export default () => {
  const canvas = useRef(null);
  const [ stars, onStarsChange] = useState(2);
  const [ status, onStatusChange ] = useState('greetings');
  const [ demo, onDemoChange ] = useState(false);
  let game;

  useEffect(() => {
    if (status === 'prepare' || demo) {
      game = new Game({
        canvas: canvas.current,
        stars: stars,
        demo,
        width: 800,
        height: 600,
        onLoose: () => onStatusChange('loose'),
        onWin: () => onStatusChange('win'),
        scoreToWin: 600,
        scorePerStar: 30,
        fontColor: '#fff',
        fontFamily: 'Roboto',
        assets: {
          sky: 'assets/sky2.png',
          ground: 'assets/platform.png',
          star: 'assets/star.png',
          bomb: 'assets/bomb.png'
        }
      });
    }
  }, [status, demo, stars]);


  const onStart = () => {
    onStatusChange('game');
    if (game) game.start();
  };

  const onPrepare = () => {
    onStatusChange('prepare')
  };
  return (
    <div>
      {status === 'greetings' ?
        <div>
          <div>Welcome to the game</div>
          <div>You need to collect 600 points and don't touch any bombs</div>
          <button onClick={onPrepare}>ok</button>
          <button onClick={() => onDemoChange(true)}>DEMO</button>
        </div>
        : null}
      {demo ?
        <div>
          <label> stars
            <input type="number" max="26" min="1" value={stars} onChange={event => onStarsChange(event.target.value)}/>
          </label>
        </div> : null}
      {['prepare', 'game'].includes(status) || demo ? <div>
        {status === 'prepare' ? <div><button onClick={onStart}>start</button></div> : null}
        <canvas ref={canvas} />
        </div> : null}
      {status === 'loose' && !demo ? <div>you are loose</div> : null}
      {status === 'win' && !demo ? <div>you are win</div> : null}
    </div>
  )
}
