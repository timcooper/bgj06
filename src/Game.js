Main.Game = function (game) {

  this.game = game;

};

Main.Game.prototype = {

  player:    Phaser.Sprite,

  preload: function () {


  },

  create: function () {

    this.game.add.tileSprite(0, 0, 24000, 800, 'background');

    this.player = this.game.add.sprite(0, 50, 'particle');
    this.player.anchor.setTo(0.5, 0.5);

    this.game.camera.follow(this.player);
    var helper = Math.max(this.game.width, this.game.height) / 8;
    console.log(Math.max(this.game.width, this.game.height));
    this.game.camera.deadzone = new Phaser.Rectangle(0, 0, 200, this.game.height);

  },

  update: function () {

    this.player.body.acceleration.x = 50;

    this.setVerticalLevel();

  },

  setVerticalLevel: function () {

    var mouseLevel = this.game.input.activePointer.y;
    if(mouseLevel < 100) {
      this.player.centerOn(this.player.center.x, 41);
    }else if(mouseLevel < 200) {
      this.player.centerOn(this.player.center.x, 141);
    }else if(mouseLevel < 300) {
      this.player.centerOn(this.player.center.x, 241);
    }

  }

}
