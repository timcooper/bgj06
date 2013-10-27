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
      gate: 'gateRed',
      end: 'endRed',
      particleFrame: 1
    },
    yellow : {
      particle: 'particleYellow',
      gate: 'gateYellow',
      end: 'endYellow',
      particleFrame: 2
    },
    blue : {
      particle: 'particleBlue',
      gate: 'gateBlue',
      end: 'endBlue',
      particleFrame: 3
    },
    orange : {
      particle: 'particleOrange',
      gate: 'gateOrange',
      end: 'endOrange',
      particleFrame: 4
    },
    green : {
      particle: 'particleGreen',
      gate: 'gateGreen',
      end: 'endGreen',
      particleFrame: 5
    },
    purple : {
      particle: 'particlePurple',
      gate: 'gatePurple',
      end: 'endPurple',
      particleFrame: 6
    },
    white : {
      particle: 'particleWhite',
      particleFrame: 0
    },
    black : {
      particle: 'particle',
      particleFrame: 7,
    }
  },

  player:    Phaser.Sprite,
  enabledColors: ['red'],
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
  emitter: null,
  rumbleSpeed: 50,
  rumbleTime: 1500,
  music: null,

  preload: function () {


  },

  create: function () {

    this.game.world.setBounds(0, 0, 12800, this.game.height);

    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.bg.fixedToCamera = true;

    this.player = this.game.add.sprite(0, 208, 'particle');
    this.player.anchor.setTo(0.5, 0.5);

    /*this.tween = this.game.add.tween(this.player.body.velocity)
          .to({x:200}, 1000, Phaser.Easing.Cubic.Out, true);*/
    this.music = this.game.add.audio('gameLoop');
    this.music.play('', 0, 0.1, true);

    this.player.body.acceleration.x = 16;
    this.player.body.velocity.x = 100;
    this.player.body.maxVelocity.x = 640;

    this.game.camera.follow(this.player);
    var helper = Math.max(this.game.width, this.game.height) / 8;

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, 200, this.game.height);

    this.enableColors();

    this.redKey    = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.yellowKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.blueKey   = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);

    this.barriers = this.game.add.group();
    this.barriers.createMultiple(25, 'barrier1');
    this.barriers.setAll('anchor.x', 0.5);
    this.barriers.setAll('body.width', 6);
    this.barriers.setAll('body.x', 26);
    this.barriers.setAll('outOfBoundsKill', true);

    this.gates = this.game.add.group();

    for(var prop in this.COLORS) {
      this.COLORS[prop].emitter = this.game.add.emitter(0, 0, 200);

      this.COLORS[prop].emitter.makeParticles('particles', [0,this.COLORS[prop].particleFrame]);
      this.COLORS[prop].emitter.gravity = 2;
      this.COLORS[prop].emitter.particleDrag.x = 500;
      this.COLORS[prop].emitter.bounce.setTo(0.5, 0.5);
    }

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

    //this.writeDebug();
  },

  atEnd: function() {
    return this.player.x >= this.game.world.width;
  },

  hitWall: function(player, barrier) {

    var gateColor = this.gates.getAt(this.barriers.getIndex(barrier)).key.slice(4).toLowerCase();

    clearInterval(this.rumbleInterval);
    this.rumbleInterval = setInterval(this.rumble, this.rumbleSpeed, this.game.camera, 10, this.player.body.velocity.x > 300 ? 80 : 50);
    clearInterval(this.rumbleTime);
    this.rumbleTime = setInterval(this.stopRumble, this.rumbleSpeed*10, this.game.camera, this.rumbleInterval);

    this.COLORS[gateColor].emitter.setXSpeed(-(this.player.body.velocity.x/3)-25, this.player.body.velocity.x);
    this.COLORS[gateColor].emitter.setYSpeed(-(this.player.body.velocity.x/3), this.player.body.velocity.x/3);
    this.COLORS[gateColor].emitter.x = barrier.x;
    this.COLORS[gateColor].emitter.y = player.y;
    this.COLORS[gateColor].emitter.start(true, 2000, null, 30);

    if(barrier.alive && ((barrier.key == 'barrier1' && this.player.center.y < 144) || 
      (barrier.key == 'barrier2' && this.player.center.y < 272 && this.player.center.x > 144) ||
      (barrier.key == 'barrier3' && this.player.center.y > 272))) {
      barrier.alive = false;
      if(this.currentColor === gateColor) {
        var audio = this.game.add.audio('gateDischarge' + this.game.rnd.integerInRange(1, 4));
        audio.play('', 0, 0.2);
        this.gatesCleared++;

        this.player.body.velocity.x += 128;
        /*this.game.add.tween(this.player.body.velocity)
          .to({x:this.player.body.velocity.x-32}, 500, Phaser.Easing.Cubic.Out, true);*/
      }else{
        this.finish(false);
      }
    }else{
        this.finish(false);
    }

  },

  finish: function(success) {
    var unlocked = Main.MainMenu.prototype.unlockedLevels,
      level = Main.MainMenu.prototype.currentLevel,
      highestGates = Main.MainMenu.prototype.highestGates;

    this.music.stop();

    clearInterval(this.rumbleInterval);
    clearInterval(this.rumbleTime);

    if(success && unlocked.length < 6) {
      if(unlocked.indexOf(level+1) === -1)
        unlocked.push(level+1);
    }else{
      if(unlocked.indexOf(level+1) === -1) {
        highestGates[level] = !highestGates.hasOwnProperty(level) || parseInt(highestGates[level]) < this.gatesCleared ? this.gatesCleared : highestGates[level];
      }
    }

    this.lastTime = this.game.time.now;

    this.game.state.start('mainmenu', true);
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

    var mouseLevel = this.game.input.activePointer.y,
      tween = this.game.add.tween(this.player);
    if(mouseLevel < 144) {
      tween.stop().to({y: this.LEVELS[1].y}, 250, Phaser.Easing.Cubic.Out, true);
      //this.player.centerOn(this.player.center.x, this.LEVELS[1].y);
    }else if(mouseLevel < 272) {
      tween.stop().to({y: this.LEVELS[2].y}, 250, Phaser.Easing.Cubic.Out, true);
      //this.player.centerOn(this.player.center.x, this.LEVELS[2].y);
    }else {
      tween.stop().to({y: this.LEVELS[3].y}, 250, Phaser.Easing.Cubic.Out, true);
      //this.player.centerOn(this.player.center.x, this.LEVELS[3].y);
    }

  },

  enableColors: function() {
    var result;
    var count = 0;
    for (var prop in this.COLORS) {
      count++;
      if(count <= Main.MainMenu.prototype.currentLevel)
          this.enabledColors.push(prop);
    }
  },

  generateLevel: function() {

    var barrier = null;
    for (var i = 0; i < this.barriers.length; i++) {
      var level = this.game.rnd.integerInRange(1, 4),
        color_string = this.enabledColors[this.game.rnd.integerInRange(1, this.enabledColors.length + 1) - 1],
        color = this.COLORS[color_string],
        barrierX = 512*(i+1);

      barrier = this.barriers.getFirstDead();
      barrier.body.customSeparateX = true;
      barrier.body.customSeparateY = true;

      if(this.barriers.length - 1 === i) {
        var end_gate = this.game.add.sprite(0,0,color.end);
        end_gate.centerOn(12800 - 109, this.LEVELS[level].y);
      }

      // set correct sprite for level
      if(level > 1)
        barrier.loadTexture('barrier'+level, 0);

      var gate = this.game.add.sprite(0,0,color.gate);
      gate.centerOn(barrierX, this.LEVELS[level].y);

      this.gates.add(gate);

      barrier.reset(barrierX, 0);
      //barrier.body.immovable = true;
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

  rumble: function(rect, x, y, rot) {

    x = x || 5;
    y = y || 5;
    rot = rot || 1;

    var rx = Math.floor(Math.random() * (x+1)) -x/2,
      ry = Math.floor(Math.random() * (y+1)) -y/2,
      rrot = Math.floor(Math.random() * (rot+1)) -rot/2;

    rx = (rx === 0 && x !== 0) ? ((Math.random() < 0.5) ? 1 : -1) : rx;
    ry = (ry === 0 && y !== 0) ? ((Math.random() < 0.5) ? 1 : -1) : ry;

    rect.x += rx;
    rect.y += ry;

  },

  stopRumble: function(rect, interval) {
    clearInterval(interval);
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
