/*! rainbows 26-10-2013 */
var Main=Main||{};Main.Game=function(a){this.game=a},Main.Game.prototype={LEVELS:{1:{y:80},2:{y:208},3:{y:336}},player:Phaser.Sprite,redKey:null,yellowKey:null,blueKey:null,bg:null,barriers:[],preload:function(){},create:function(){this.game.world.setBounds(0,0,1e4,this.game.height),this.bg=this.game.add.tileSprite(0,0,this.game.width,this.game.height,"background"),this.bg.fixedToCamera=!0,this.player=this.game.add.sprite(0,50,"particle"),this.player.anchor.setTo(.5,.5),this.player.body.acceleration.x=100,this.game.camera.follow(this.player),Math.max(this.game.width,this.game.height)/8,this.game.camera.deadzone=new Phaser.Rectangle(0,0,200,this.game.height),this.redKey=this.game.input.keyboard.addKey(Phaser.Keyboard.ONE),this.yellowKey=this.game.input.keyboard.addKey(Phaser.Keyboard.TWO),this.blueKey=this.game.input.keyboard.addKey(Phaser.Keyboard.THREE),this.barriers=this.game.add.group(),this.barriers.createMultiple(30,"barrier1"),this.barriers.setAll("anchor.x",.5),this.barriers.setAll("anchor.y",.5),this.barriers.setAll("outOfBoundsKill",!0);for(var a=null,b=0;b<this.barriers.length;b++)a=this.barriers.getFirstDead(),a.reset(-this.game.camera.x+24e3*Math.random(),this.LEVELS[1+Math.floor(3*Math.random())].y),a.body.immovable=!0},update:function(){this.bg.tilePosition.x=-this.game.camera.x,this.bg.tilePosition.y=-this.game.camera.y,this.setVerticalLevel(),this.game.physics.collide(this.barriers,this.player,this.hitWall,null,this),this.colorBlack(),this.redKey.isDown&&this.colorRed(),this.yellowKey.isDown&&this.colorYellow(),this.blueKey.isDown&&this.colorBlue(),this.atEnd()&&this.game.state.start("game")},atEnd:function(){return this.player.x>=this.game.world.width},hitWall:function(){console.log("wall")},colorBlack:function(){this.player.loadTexture("particle",0)},colorRed:function(){this.yellowKey.isDown&&this.blueKey.isDown?this.player.loadTexture("particleWhite",0):this.yellowKey.isDown?this.player.loadTexture("particleOrange",0):this.blueKey.isDown?this.player.loadTexture("particlePurple",0):this.player.loadTexture("particleRed",0)},colorYellow:function(){this.redKey.isDown&&this.blueKey.isDown?this.player.loadTexture("particleWhite",0):this.redKey.isDown?this.player.loadTexture("particleOrange",0):this.blueKey.isDown?this.player.loadTexture("particleGreen",0):this.player.loadTexture("particleYellow",0)},colorBlue:function(){this.yellowKey.isDown&&this.redKey.isDown?this.player.loadTexture("particleWhite",0):this.yellowKey.isDown?this.player.loadTexture("particleGreen",0):this.redKey.isDown?this.player.loadTexture("particlePurple",0):this.player.loadTexture("particleBlue",0)},setVerticalLevel:function(){var a=this.game.input.activePointer.y;144>a?this.player.centerOn(this.player.center.x,this.LEVELS[1].y):272>a?this.player.centerOn(this.player.center.x,this.LEVELS[2].y):this.player.centerOn(this.player.center.x,this.LEVELS[3].y)}};