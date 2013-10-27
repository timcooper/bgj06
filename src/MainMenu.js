var Main = Main || {};

Main.MainMenu = function (game) {

  //  Our main menu
  this.game = game;

};

Main.MainMenu.prototype = {

  currentLevel: 1,
  unlockedLevels: [1],
  highestGates: {},
  music: null,

  create: function () {

    this.music = this.game.add.audio('menuLoop');
    this.music.play('', 0, 0.1, true);

    //var tween = this.game.add.tween(this.music)
    //  .to({volume: 0.5}, 1000, Phaser.Easing.Cubic.In, true);

    var bg = this.game.add.sprite(0, 0, 'title');
    bg.fixedToCamera = true;

    var name = this.game.add.sprite(58, 116, 'titleName');
    name.fixedToCamera = true;

    var nameTween = this.game.add.tween(name)
      .to({x:name.position.x + 1, y:name.position.y + 3}, 3000, Phaser.Easing.Sinusoidal.In, true)
      .to({x:name.position.x -1, y:name.position.y - 3}, 3000, Phaser.Easing.Sinusoidal.Out, true)
      .loop();

    var button = this.game.add.button(60, 207, 'button', this.startGame, this, 2, 1, 3);
    button.fixedToCamera = true;
    button.name = 1;

    for (var i = 6; i > 1; i--) {
      var over, out, down,
        disabled = 0;

      if(this.unlockedLevels.indexOf(i) === -1) {
        disabled = 1;
        over = out = down = 4*i-4;
      }else{
        over = 4*i-2;
        out  = 4*i-3;
        down = 4*i-1;
      }
      button = this.game.add.button(60 + (42 * (i-1)), 207, 'button', this.startGame, this, over, out, down);

      button.fixedToCamera = true;

      if(disabled) {
        button.input.useHandCursor = false;
      }
      button.name = i;
    }

  },

  startGame: function (button) {
    var tween = this.game.add.tween(this.music)
      .to({volume: 0}, 1000, Phaser.Easing.Cubic.Out, true);
    tween.onComplete.add(this.stopMenuMusic, this);
    if(this.unlockedLevels.indexOf(button.name) !== -1) {
      Main.MainMenu.prototype.currentLevel = button.name;
      this.game.state.start('game');
    }

  },

  stopMenuMusic: function() {
    this.music.stop();
  }

};