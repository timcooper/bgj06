var Main = Main || {};

Main.MainMenu = function (game) {

  //  Our main menu
  this.game = game;

};

Main.MainMenu.prototype = {

  currentLevel: 1,
  unlockedLevels: [1],
  highestGates: {},

  create: function () {
    
    var bg = this.game.add.sprite(0, 0, 'title');
    bg.fixedToCamera = true;

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

    if(this.unlockedLevels.indexOf(button.name) !== -1) {
      Main.MainMenu.prototype.currentLevel = button.name;
      this.game.state.start('game');
    }

  }

};