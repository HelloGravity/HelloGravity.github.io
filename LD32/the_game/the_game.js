function the_game(game) {
	var player;
	var ground;
	var is_going_left = false;
	var last_is_going_left = false;
	var rainbows = [];

	this.init = function() {
		/* create ground */
		ground = game.add.sprite(0,game.height, 'ground');
		ground.anchor.set(.5,.5)
		ground.y -= 0.5*ground.height
		ground.x += 0.5*ground.width
   	  	game.physics.enable(ground, Phaser.Physics.ARCADE);
   	  	ground.body.immovable = true;
   	  	ground.body.moves = false;
   	  	ground.body.height *= 0.2;
		

		/* craete player */
		player = game.add.sprite(72,72, 'meow-the-cat');
		player.animations.add('fly');
		player.x = 200	
		player.y = 200
		player.anchor.setTo(.5,.5);
		player.scale.x = -1;
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.gravity.y = 320;
		this.player = player;

		this.player.body.collideWorldBounds = true;

		/* handle spacebar */
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function() {
			player.body.velocity.y = -300;
		}, this);

		this.player = player
		this.rainbows = rainbows
		this.ground = ground	
	}
	this.cleanup = function() {
		game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
		clear_all_rainbows();
		if(player) player.destroy();
	}
	this.update = function() {
		game.physics.arcade.collide(player, ground);

		do_rainbow();
		do_meow();
	}

	this.nextScreen = function() {
		if(false) {
			return new endScreen(game);
		}
		return null;
	}

	function clear_all_rainbows()
	{
		_.forEach(rainbows, function(rainbow) {
		 	rainbow.destroy();
		});
		rainbows = [];
	}

	function do_rainbow()
	{
		/* add rainbows */
		var new_rainbow = game.add.sprite(1,7, 'rainbow');
		game.physics.enable(new_rainbow, Phaser.Physics.ARCADE);
		new_rainbow.x = player.x + player.width * (is_going_left ? 0.2 : 0.27);
		new_rainbow.y = player.body.center.y;
		new_rainbow.body.velocity.x = is_going_left ? 60: -60;
		new_rainbow.scale.set(4,4);
		rainbows.push(new_rainbow);
		
		_(rainbows).forEach(function(rainbow) {
		 	rainbow.alpha *= 0.95;
		}).remove(function(rainbow) {
		  return !rainbow.inCamera || rainbow.alpha < 0.01;
		}).forEach(function(rainbow) {
		 	rainbow.destroy();
		}).value();
	}

	function do_meow()
	{	
		var left_pressed = game.input.keyboard.isDown(Phaser.Keyboard.LEFT);
		var right_pressed = game.input.keyboard.isDown(Phaser.Keyboard.RIGHT);

		
		if(left_pressed)
		{
			player.body.velocity.x = -100;
		}
		if(right_pressed)
		{
			player.body.velocity.x = 100;
		}
		if (!right_pressed && !left_pressed)
		{
			player.body.velocity.x = 0;	
		}

		is_going_left = player.body.velocity.x < 0;
		if (is_going_left ^ last_is_going_left)
		{
			clear_all_rainbows();
		}
		last_is_going_left = is_going_left;

		/* change meow's animation according to velocity */
		if (player.body.velocity.y < 0) {
			player.animations.play('fly', 17, true);
		}
		else {
			player.animations.stop('fly');
			player.frame = 0;
		}
		if (player.body.velocity.x > 0)
		{
			player.scale.x = -1;
		}
		if (player.body.velocity.x < 0)
		{
			player.scale.x = 1;
		}
		player.bringToTop();
	}
}