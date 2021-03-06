import Phaser from 'phaser';

interface ISceneProps {
  onLoose: () => void;
  onWin: () => void;
  isEnd: boolean;
  scoreToWin: number;
  starsCount: number;
  scorePerStar: number;
  assets: object;
  fontColor: string;
  fontFamily: string;
}

interface IScene {
  preload(): void;
  create(): void;
  update(): void;
  hitBomb(player: any): void;
  collectStar(player: any, star: any): void;
}

class Scene extends Phaser.Scene implements IScene {
  private onLoose: () => void;
  private onWin: () => void;
  private isEnd: boolean;
  private timerId: number | null;
  private scoreToWin: number;
  private starsCount: number;
  private scorePerStar: number;
  private assets: object;
  private fontColor: string;
  private fontFamily: string;

  constructor(props: ISceneProps) {
    // @ts-ignore
    super(props);
    this.onLoose = props.onLoose;
    this.onWin = props.onWin;
    this.isEnd = false;
    this.timerId = null;
    this.scoreToWin = props.scoreToWin;
    this.starsCount = props.starsCount;
    this.scorePerStar = props.scorePerStar;
    this.assets = props.assets;
    this.fontColor = props.fontColor;
    this.fontFamily = props.fontFamily;
  }



  sendAnalytic = function() {
    // here will be send analytics request
    fetch('https://api.ipify.org?format=json', { method: 'get'})
      .then((response) => response.json())
      .then(response => console.log(response));
  };

  preload = function () {
    Object.keys(this.assets).map(key => {
      this.load.image(key, this.assets[key]);
    });
    this.load.spritesheet('dude',
      'assets/dude.png',
      {frameWidth: 32, frameHeight: 48}
    );
  };

  create = function () {
    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');

    this.player = this.physics.add.sprite(100, 450, 'dude');

    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{key: 'dude', frame: 4}],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
      frameRate: 10,
      repeat: -1
    });

    //  Input Events
    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({
      key: 'star',
      repeat: this.starsCount - 1,
      setXY: {x: 20, y: 0, stepX: 30}
    });

    this.stars.children.iterate(function (child: any) {
      child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
    });

    this.bombs = this.physics.add.group();
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: this.fontColor,
      fontFamily: this.fontFamily
    });
    this.physics.add.collider(this.player, this.platforms);
    this.physics.add.collider(this.stars, this.platforms);
    this.physics.add.collider(this.bombs, this.platforms);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
    this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    this.timerId = setInterval(() => this.sendAnalytic(), 3000);
  };

  update = function () {
    if (this.isEnd) {
      clearInterval(this.timerId);
      return;
    }

    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);

      this.player.anims.play('left', true);
    }
    else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);

      this.player.anims.play('right', true);
    }
    else {
      this.player.setVelocityX(0);

      this.player.anims.play('turn');
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-330);
    }

    if (this.cursors.down.isDown) {
      this.player.setVelocityY(660);
    }
  };

  hitBomb = function (player: any) {
    this.physics.pause();

    player.setTint(0xff0000);

    player.anims.play('turn');

    this.isEnd = true;
    this.onLoose();
  };

  collectStar = function (player: any, star: any) {
    star.disableBody(true, true);

    this.score = this.score || 0;
    this.score = this.score + this.scorePerStar;
    this.scoreText.setText('Score: ' + this.score);

    if (this.score >= this.scoreToWin) {
      this.isEnd = true;
      this.onWin();
    }

    if (this.stars.countActive(true) === 0) {
      this.stars.children.iterate(function (child: any) {
        child.enableBody(true, child.x, 0, true, true);

      });

      const x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

      const bomb = this.bombs.create(x, 16, 'bomb');
      bomb.setBounce(1);
      bomb.setCollideWorldBounds(true);
      bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
      bomb.allowGravity = false;
    }
  }
}

interface GameConfigs {
  type: number;
  width: number;
  height: number;
  canvas: HTMLCanvasElement,
  autoStart: boolean;
  physics: object;
}

export default class Game {
  private configs: GameConfigs;
  private game: any;

  constructor(props: any) {
    this.configs = {
      type: Phaser.CANVAS,
      width: props.width || 800,
      height: props.height || 600,
      canvas: props.canvas,
      autoStart: false,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: {y: 300},
          debug: false
        }
      },
      ...props
    };
    const scene = new Scene(props);
    this.game = new Phaser.Game(this.configs);
    this.game.scene.add('Game', scene);
    this.game.scene.start('Game');
  }
}
