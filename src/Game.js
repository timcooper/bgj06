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
      particle: 'particleRed',
      gate: 'gateRed'
    },
    yellow : {
      particle: 'particleYellow',
      gate: 'gateYellow'
    },
    blue : {
      particle: 'particleBlue',
      gate: 'gateBlue'
    },
    orange : {
      particle: 'particleOrange',
      gate: 'gateOrange'
    },
    green : {
      particle: 'particleGreen',
      gate: 'gateGreen'
    },
    purple : {
      particle: 'particlePurple',
      gate: 'gatePurple'
    },
    white : {
      particle: 'particleWhite'
    },
    black : {
      particle: 'particle',
    }
  },

  player:    Phaser.Sprite,
  enabledColors: ['red', 'blue', 'yellow'],
  redKey:    null,
  yellowKey: null,
  blueKey:   null,
  bg: null,
  barriers: [],
  gates: [],
  maxVelocity: 0,
  currentColor: 'black',
  tween: null,
  gatesCleared: 0,
  lastTime: 0,

  preload: function () {


  },

  create: function () {

    this.game.world.setBounds(0, 0, 12800, this.game.height);

    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.bg.fixedToCamera = true;

    this.player = this.game.add.sprite(0, 50, 'particle');
    this.player.anchor.setTo(0.5, 0.5);

    //this.player.body.acceleration.x = 32;
    this.tween = this.game.add.tween(this.player.body.velocity)
          .to({x:200}, 1000, Phaser.Easing.Cubic.Out, true);

    this.player.body.acceleration.x = 16;
    this.player.body.maxVelocity.x = 640;

    this.game.camera.follow(this.player);
    var helper = Math.max(this.game.width, this.game.height) / 8;

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, 200, this.game.height);

    this.redKey    = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.yellowKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.blueKey   = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    this.barriers = this.game.add.group();
    this.barriers.createMultiple(25, 'barrier1');
    this.barriers.setAll('anchor.x', 0.5);
    this.barriers.setAll('outOfBoundsKill', true);

    this.gates = this.game.add.group();

    this.generateLevel();

    this.player.bringToTop();

  },

  update: function () {

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
      this.finish(true);
    }

    this.writeDebug();
  },

  finish: function(success) {
    if(success) {
      alert('Winner! You cleared all ' + this.gatesCleared + ' gates!');
    }else{
      alert('Fail! You crashed after ' + (this.gatesCleared) + '/25 gates');
    }
    this.gatesCleared = 0;
    this.lastTime = this.game.time.now;
    this.game.state.start('game');
  },

  atEnd: function() {
    return this.player.x >= this.game.world.width;
  },

  hitWall: function(particle, barrier) {

    if(barrier.alive && ((barrier.key == 'barrier1' && this.player.center.y < 144) || 
      (barrier.key == 'barrier2' && this.player.center.y < 272 && this.player.center.x > 144) ||
      (barrier.key == 'barrier3' && this.player.center.y > 272))) {
      barrier.alive = false;
      if('gate'+this.currentColor.charAt(0).toUpperCase() + this.currentColor.slice(1) === this.gates.getAt(this.barriers.getIndex(barrier)).key) {
        this.gatesCleared++;
        console.log('win');
        this.player.body.velocity.x += 128;
        this.game.add.tween(this.player.body.velocity)
          .to({x:this.player.body.velocity.x-32}, 500, Phaser.Easing.Cubic.Out, true);
      }else{
        this.finish(false);
      }
    }else{
        this.finish(false);
    }

  },

  colorBlack: function() {
    this.currentColor = 'black';
    this.player.loadTexture(this.COLORS.black.particle, 0);
  },

  colorRed: function() {
    if(this.yellowKey.isDown && this.blueKey.isDown && this.canChange('white')) {
      this.currentColor = 'white';
      this.player.loadTexture(this.COLORS.white.particle, 0);
    }else if(this.yellowKey.isDown && this.canChange('orange')) {
      this.currentColor = 'orange';
      this.player.loadTexture(this.COLORS.orange.particle, 0);
    }else if(this.blueKey.isDown && this.canChange('purple')) {
      this.currentColor = 'purple';
      this.player.loadTexture(this.COLORS.purple.particle, 0);
    }else{
      this.currentColor = 'red';
      this.player.loadTexture(this.COLORS.red.particle, 0);
    }
  },

  colorYellow: function() {
    if(this.redKey.isDown && this.blueKey.isDown && this.canChange('white')) {
      this.currentColor = 'white';
      this.player.loadTexture(this.COLORS.white.particle, 0);
    }else if(this.redKey.isDown && this.canChange('orange')) {
      this.currentColor = 'orange';
      this.player.loadTexture(this.COLORS.orange.particle, 0);
    }else if(this.blueKey.isDown && this.canChange('green')) {
      this.currentColor = 'green';
      this.player.loadTexture(this.COLORS.green.particle, 0);
    }else if(this.canChange('yellow')) {
      this.currentColor = 'yellow';
      this.player.loadTexture(this.COLORS.yellow.particle, 0);
    }
  },

  colorBlue: function() {
    if(this.yellowKey.isDown && this.redKey.isDown && this.canChange('white')) {
      this.currentColor = 'white';
      this.player.loadTexture(this.COLORS.white.particle, 0);
    }else if(this.yellowKey.isDown && this.canChange('green')) {
      this.currentColor = 'green';
      this.player.loadTexture(this.COLORS.green.particle, 0);
    }else if(this.redKey.isDown && this.canChange('purple')) {
      this.currentColor = 'purple';
      this.player.loadTexture(this.COLORS.purple.particle, 0);
    }else if(this.canChange('blue')) {
      this.currentColor = 'blue';
      this.player.loadTexture(this.COLORS.blue.particle, 0);
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
      var level = this.game.rnd.integerInRange(1, 4),
        color = this.COLORS[this.enabledColors[this.game.rnd.integerInRange(1, this.enabledColors.length + 1) - 1]],
        barrierX = 512*(i+1);

      barrier = this.barriers.getFirstDead();
      barrier.body.customSeparateX = true;
      barrier.body.customSeparateY = true;

      // set correct sprite for level
      if(level > 1)
        barrier.loadTexture('barrier'+level, 0);

      var gate = this.game.add.sprite(0,0,color.gate);
      gate.centerOn(barrierX, this.LEVELS[level].y);

      this.gates.add(gate);

      barrier.reset(barrierX, 0);
      barrier.body.immovable = true;
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
