var Main = Main || {};

Main.Preloader = function (game) {

  this.game = game;

};

Main.Preloader.prototype = {

  preload: function () {

    this.game.load.image('title', 'assets/img/title.png');
    this.game.load.image('titleName', 'assets/img/title-name.png');
    this.game.load.image('particle', 'assets/img/particle.png');
    this.game.load.image('particleRed', 'assets/img/particle_red.png');
    this.game.load.image('particleYellow', 'assets/img/particle_yellow.png');
    this.game.load.image('particleBlue', 'assets/img/particle_blue.png');
    this.game.load.image('particleOrange', 'assets/img/particle_orange.png');
    this.game.load.image('particlePurple', 'assets/img/particle_purple.png');
    this.game.load.image('particleGreen', 'assets/img/particle_green.png');
    this.game.load.image('particleWhite', 'assets/img/particle_white.png');
    this.game.load.image('background', 'assets/img/background.png');
    this.game.load.image('barrier1', 'assets/img/barrier_1.png');
    this.game.load.image('barrier2', 'assets/img/barrier_2.png');
    this.game.load.image('barrier3', 'assets/img/barrier_3.png');
    this.game.load.image('gateRed', 'assets/img/gate_red.png');
    this.game.load.image('gateYellow', 'assets/img/gate_yellow.png');
    this.game.load.image('gateBlue', 'assets/img/gate_blue.png');
    this.game.load.image('gateOrange', 'assets/img/gate_orange.png');
    this.game.load.image('gateGreen', 'assets/img/gate_green.png');
    this.game.load.image('gatePurple', 'assets/img/gate_purple.png');
    this.game.load.image('endRed', 'assets/img/end_red.png');
    this.game.load.image('endYellow', 'assets/img/end_yellow.png');
    this.game.load.image('endBlue', 'assets/img/end_blue.png');
    this.game.load.image('endOrange', 'assets/img/end_orange.png');
    this.game.load.image('endGreen', 'assets/img/end_green.png');
    this.game.load.image('endPurple', 'assets/img/end_purple.png');
    this.game.load.spritesheet('particles', 'assets/img/particles.png', 5, 5);
    this.game.load.spritesheet('button', 'assets/img/buttons.png', 33,33);

    this.game.load.audio('menuLoop', [
      'assets/audio/514892_Short-Loop.mp3',
      'assets/audio/514892_Short-Loop.ogg'
    ]);
    this.game.load.audio('gameLoop', [
      'assets/audio/554049_Chased-By-Monsters.mp3',
      'assets/audio/554049_Chased-By-Monsters.ogg'
    ]);
    this.game.load.audio('gateDischarge1', [
      'assets/audio/gateDischarge.mp3',
      'assets/audio/gateDischarge.ogg'
    ]);
    this.game.load.audio('gateDischarge2', [
      'assets/audio/gateDischarge2.mp3',
      'assets/audio/gateDischarge2.ogg'
    ]);
    this.game.load.audio('gateDischarge3', [
      'assets/audio/gateDischarge3.mp3',
      'assets/audio/gateDischarge3.ogg'
    ]);

  },

  create: function () {

    this.game.stage.backgroundColor = '#ffffff';

    this.game.state.start('mainmenu');

  }

};
