var Main = Main || {};

Main.Game = function (game) {

  this.game = game;

};

Main.Game.prototype = {

  LEVELS: {
    1: {
      y: 80
    },
    2: {
      y: 208
    },
    3: {
      y: 336
    }
  },

  COLORS: {
    red : {
      sprite: 'particleRed'
    },
    yellow : {
      sprite: 'particleYellow'
    },
    blue : {
      sprite: 'particleBlue'
    },
    orange : {
      sprite: 'particleOrange'
    },
    green : {
      sprite: 'particleGreen'
    },
    purple : {
      sprite: 'particlePurple'
    },
    white : {
      sprite: 'particleWhite'
    },
    black : {
      sprite: 'particle'
    }
  },

  player:    Phaser.Sprite,
  enabledColors: ['red'],
  redKey:    null,
  yellowKey: null,
  blueKey:   null,
  bg: null,
  barriers: [],
  maxVelocity: 0,

  preload: function () {


  },

  create: function () {

    this.game.world.setBounds(0, 0, 12800, this.game.height);

    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.bg.fixedToCamera = true;

    this.player = this.game.add.sprite(0, 50, 'particle');
    this.player.anchor.setTo(0.5, 0.5);

    this.player.body.acceleration.x = 100;

    this.game.camera.follow(this.player);
    var helper = Math.max(this.game.width, this.game.height) / 8;

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, 200, this.game.height);

    this.redKey    = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.yellowKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.blueKey   = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    this.barriers = this.game.add.group();
    this.barriers.createMultiple(30, 'barrier1');
    this.barriers.setAll('anchor.x', 0.5);
    this.barriers.setAll('anchor.y', 0.5);
    this.barriers.setAll('outOfBoundsKill', true);

    this.generateLevel();

  },

  update: function () {
    var time   = this.game.time.elapsed,
      deviance = 2* time / (1+time);

    this.bg.tilePosition.x = -this.game.camera.x;
    this.bg.tilePosition.y = -this.game.camera.y;

    this.setVerticalLevel();

    this.game.physics.collide(this.barriers, this.player, this.hitWall, null, this);

    this.colorBlack();

    if(this.redKey.isDown)
      this.colorRed();
    if(this.yellowKey.isDown)
      this.colorYellow();
    if(this.blueKey.isDown)
      this.colorBlue();

    if(this.atEnd()) {
      alert('Max velocity: ' + this.maxVelocity);
      this.game.state.start('game');
    }

  },

  atEnd: function() {
    return this.player.x >= this.game.world.width;
  },

  hitWall: function() {
    console.log('wall');
  },

  colorBlack: function() {
    this.player.loadTexture(this.COLORS.black.sprite, 0);
  },

  colorRed: function() {
    if(this.yellowKey.isDown && this.blueKey.isDown && this.canChange('white')) {
      this.player.loadTexture(this.COLORS.white.sprite, 0);
    }else if(this.yellowKey.isDown && this.canChange('orange')) {
      this.player.loadTexture(this.COLORS.orange.sprite, 0);
    }else if(this.blueKey.isDown && this.canChange('purple')) {
      this.player.loadTexture(this.COLORS.purple.sprite, 0);
    }else{
      this.player.loadTexture(this.COLORS.red.sprite, 0);
    }
  },

  colorYellow: function() {
    if(this.redKey.isDown && this.blueKey.isDown && this.canChange('white')) {
      this.player.loadTexture(this.COLORS.white.sprite, 0);
    }else if(this.redKey.isDown && this.canChange('orange')) {
      this.player.loadTexture(this.COLORS.orange.sprite, 0);
    }else if(this.blueKey.isDown && this.canChange('green')) {
      this.player.loadTexture(this.COLORS.green.sprite, 0);
    }else if(this.canChange('yellow')) {
      this.player.loadTexture(this.COLORS.yellow.sprite, 0);
    }
  },

  colorBlue: function() {
    if(this.yellowKey.isDown && this.redKey.isDown && this.canChange('white')) {
      this.player.loadTexture(this.COLORS.white.sprite, 0);
    }else if(this.yellowKey.isDown && this.canChange('green')) {
      this.player.loadTexture(this.COLORS.green.sprite, 0);
    }else if(this.redKey.isDown && this.canChange('purple')) {
      this.player.loadTexture(this.COLORS.purple.sprite, 0);
    }else if(this.canChange('blue')) {
      this.player.loadTexture(this.COLORS.blue.sprite, 0);
    }
  },

  setVerticalLevel: function () {

    var mouseLevel = this.game.input.activePointer.y;
    if(mouseLevel < 144) {
      this.player.centerOn(this.player.center.x, this.LEVELS[1].y);
    }else if(mouseLevel < 272) {
      this.player.centerOn(this.player.center.x, this.LEVELS[2].y);
    }else {
      this.player.centerOn(this.player.center.x, this.LEVELS[3].y);
    }

  },

  generateLevel: function() {

    var barrier = null;
    for (var i = 0; i < this.barriers.length; i++) {
      barrier = this.barriers.getFirstDead();

      barrier.reset(512*(i+1), this.LEVELS[1+Math.floor(Math.random()*3)].y);
      barrier.body.immovable = true;

      console.log('color = ' + this.randomColor());
    }

  },

  canChange: function(color) {
    return this.enabledColors.indexOf(color) !== -1;
  },

  randomColor: function() {
    var result;
    var count = 0;
    for (var prop in this.COLORS)
      if (this.canChange(prop) && Math.random() < 1/++count)
        result = prop;
    return result;
  },

  writeDebug: function () {
    var $velocity = window.document.getElementById('debug-velocity'),
        velocity = Math.round(this.player.body.velocity.x),
        $dist  = window.document.getElementById('debug-dist');

    if(velocity > this.maxVelocity)
      this.maxVelocity = velocity;

    $velocity.innerHTML = velocity;
    $dist.innerHTML = Math.round(this.player.center.x + this.game.camera.x);
  }

};
