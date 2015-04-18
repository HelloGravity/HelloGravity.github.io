function platformer(game) {
	var player, goBackBanner, platforms, item;
	var hasPicked = false, hasLeft = false;
	var facing = '';
	var jumpTimer = 0;
	
	this.init = function() {
		game.stage.backgroundColor = '#4E2121';

		item = game.add.sprite(933,98, 'platformer-item');
    	item.scale.x = item.scale.y = 0.1;


		player = game.add.sprite(1090,985, 'menu-menu');
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.animations.add('right', [0, 1, 2, 3], 10, true);
    	player.animations.add('left', [4, 5, 6, 7], 10, true);
    	player.body.collideWorldBounds = true;
		game.camera.follow(player);
		player.body.gravity.y = 1500;

		game.world.setBounds(0, 0, 1195, 1100);

  		platforms = game.add.group();
		platforms.enableBody = true;
   	 	platforms.physicsBodyType = Phaser.Physics.ARCADE;
  
 	 	platforms.create(990, 1060, 'platformer-1').body.immovable = true;
    	platforms.create(869, 1060, 'platformer-1').body.immovable = true;
		platforms.create(909, 1000, 'platformer-2').body.immovable = true;

		platforms.create(757, 879, 'platformer-13').body.immovable = true;
		platforms.create(634, 790, 'platformer-3').body.immovable = true;
		platforms.create(488, 743, 'platformer-3').body.immovable = true;

		platforms.create(335, 691, 'platformer-3').body.immovable = true;
		platforms.create(201, 631, 'platformer-3').body.immovable = true;
		platforms.create(1, 527, 'platformer-4').body.immovable = true;
		platforms.create(224, 406, 'platformer-5').body.immovable = true;
		platforms.create(401, 273, 'platformer-7').body.immovable = true;
		platforms.create(529, 181, 'platformer-7').body.immovable = true;
		platforms.create(805, 298, 'platformer-8').body.immovable = true;
		platforms.create(845, 618, 'platformer-9').body.immovable = true;

		platforms.create(1077, 380, 'platformer-11').body.immovable = true;

		platforms.create(940, 508, 'platformer-6').body.immovable = true;
		platforms.create(1145, 249, 'platformer-6').body.immovable = true;

		platforms.create(891, 14, 'platformer-12').body.immovable = true;
		platforms.create(891, 134, 'platformer-10').body.immovable = true;

	}
	this.cleanup = function() {
		if(player)player.destroy();
		if(goBackBanner)goBackBanner.destroy();
		if(item)item.destroy();
		if(platforms)platforms.destroy();
		game.world.setBounds(0, 0, 800, 600);
	}
	this.update = function() {
		game.physics.arcade.collide(player, platforms);


		 player.body.velocity.x = 0;

	 	if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
        	player.body.velocity.x = -150;
        	if (facing != 'left') {
            	player.animations.play('left');
            	facing = 'left';
       		}
    	} else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
        	player.body.velocity.x = 150;
        	if (facing != 'right') {
            	player.animations.play('right');
            	facing = 'right';
        	}
    	}
    	else {
        	if (facing != 'idle') {
            	player.animations.stop();
            	if (facing == 'left') {
                	player.frame = 4;
            	} else {
                player.frame = 0;
            	}
            	facing = 'idle';
       		}
   		}
    	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && (player.body.touching.down || player.body.onFloor())&& game.time.now > jumpTimer) {
        	player.body.velocity.y = -640;
        	jumpTimer = game.time.now + 750;
    	}
	   	if(!hasPicked && Phaser.Rectangle.intersects(item.getBounds(), player.getBounds())) {
	   		goBackBanner = game.add.sprite(400,400, 'platformer-instructions');
	   		hasPicked = true;
	   		if(item) {
	   			item.destroy();
	   			item = undefined;
	   		}
	   	}
	   	if(hasPicked) {
	   		if(player.x >= 1128 && player.y  > 980) {
	   			hasLeft = true;
	   		}
	   	}
	}

	this.nextScreen = function() {
		if(hasLeft) {
			return new endScreen(game);
		}
		return null;
	}
	
}