/*! rainbows 27-10-2013 */
var Main=Main||{};Main.Preloader=function(a){this.game=a},Main.Preloader.prototype={preload:function(){this.game.load.image("particle","assets/img/particle.png"),this.game.load.image("particleRed","assets/img/particle_red.png"),this.game.load.image("particleYellow","assets/img/particle_yellow.png"),this.game.load.image("particleBlue","assets/img/particle_blue.png"),this.game.load.image("particleOrange","assets/img/particle_orange.png"),this.game.load.image("particlePurple","assets/img/particle_purple.png"),this.game.load.image("particleGreen","assets/img/particle_green.png"),this.game.load.image("particleWhite","assets/img/particle_white.png"),this.game.load.image("background","assets/img/background.png"),this.game.load.image("barrier1","assets/img/single_barrier.png")},create:function(){this.game.stage.backgroundColor="#ffffff",this.game.state.start("game")}};