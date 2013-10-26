var Main = {};

Main.Preloader = function (game) {

	this.game = game;

};

Main.Preloader.prototype = {

	preload: function () {

		this.game.load.image('particle', 'assets/img/particle.png');
		this.game.load.image('background', 'assets/img/sky-2x.png');

	},

	create: function () {

    	this.game.stage.backgroundColor = '#ffffff';

    	this.game.world.setBounds(0, 0, 24000, 300);

		this.game.state.start('game');

	}

}
