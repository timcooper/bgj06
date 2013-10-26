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

  player:    Phaser.Sprite,
  redKey:    null,
  yellowKey: null,
  blueKey:   null,
  bg: null,

  preload: function () {


  },

  create: function () {

    this.game.world.setBounds(0, 0, 5000, this.game.height);

    this.bg = this.game.add.tileSprite(0, 0, this.game.width, this.game.height, 'background');
    this.bg.fixedToCamera = true;

    this.player = this.game.add.sprite(0, 50, 'particle');
    this.player.anchor.setTo(0.5, 0.5);

    this.game.camera.follow(this.player);
    var helper = Math.max(this.game.width, this.game.height) / 8;

    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, 200, this.game.height);

    this.redKey    = this.game.input.keyboard.addKey(Phaser.Keyboard.ONE);
    this.yellowKey = this.game.input.keyboard.addKey(Phaser.Keyboard.TWO);
    this.blueKey   = this.game.input.keyboard.addKey(Phaser.Keyboard.THREE);

  },

  update: function () {

    this.bg.tilePosition.x = -this.game.camera.x;
    this.bg.tilePosition.y = -this.game.camera.y;

    this.player.body.acceleration.x = 50;

    this.setVerticalLevel();

    this.colorBlack();

    if(this.redKey.isDown)
      this.colorRed();
    if(this.yellowKey.isDown)
      this.colorYellow();
    if(this.blueKey.isDown)
      this.colorBlue();

  },

  colorBlack: function() {
    this.player.loadTexture('particle', 0);
  },

  colorRed: function() {
    if(this.yellowKey.isDown && this.blueKey.isDown) {
      this.player.loadTexture('particleWhite', 0);
    }else if(this.yellowKey.isDown) {
      this.player.loadTexture('particleOrange', 0);
    }else if(this.blueKey.isDown) {
      this.player.loadTexture('particlePurple', 0);
    }else{
      this.player.loadTexture('particleRed', 0);
    }
  },

  colorYellow: function() {
    if(this.redKey.isDown && this.blueKey.isDown) {
      this.player.loadTexture('particleWhite', 0);
    }else if(this.redKey.isDown) {
      this.player.loadTexture('particleOrange', 0);
    }else if(this.blueKey.isDown) {
      this.player.loadTexture('particleGreen', 0);
    }else{
      this.player.loadTexture('particleYellow', 0);
    }
  },

  colorBlue: function() {
    if(this.yellowKey.isDown && this.redKey.isDown) {
      this.player.loadTexture('particleWhite', 0);
    }else if(this.yellowKey.isDown) {
      this.player.loadTexture('particleGreen', 0);
    }else if(this.redKey.isDown) {
      this.player.loadTexture('particlePurple', 0);
    }else{
      this.player.loadTexture('particleBlue', 0);
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

  }

}
