var Main = {};

Main.Preloader = function (game) {

	this.game = game;

};

Main.Preloader.prototype = {

	preload: function () {

		this.game.load.image('particle', 'assets/img/particle.png');
		this.game.load.image('particleRed', 'assets/img/particle_red.png');
		this.game.load.image('particleYellow', 'assets/img/particle_yellow.png');
		this.game.load.image('particleBlue', 'assets/img/particle_blue.png');
		this.game.load.image('particleOrange', 'assets/img/particle_orange.png');
		this.game.load.image('particlePurple', 'assets/img/particle_purple.png');
		this.game.load.image('particleGreen', 'assets/img/particle_green.png');
		this.game.load.image('particleWhite', 'assets/img/particle_white.png');
		this.game.load.image('background', 'assets/img/sky-2x.png');

	},

	create: function () {

    	this.game.stage.backgroundColor = '#ffffff';

    	this.game.world.setBounds(0, 0, 24000, 300);

		this.game.state.start('game');

	}

}
