function the_game(game) {
	var player;
	var last_is_space_pressed = false;
	this.init = function() {
		player = game.add.sprite(36,36, 'meow-the-cat');
		player.animations.add('fly');
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.gravity.y = 120;
		this.player = player;
	}
	this.cleanup = function() {
		if(player) player.destroy();
	}
	this.update = function() {
		/* handle spacebar presses */
		var is_space_pressed = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
		if ((!last_is_space_pressed) && is_space_pressed)
		{
			player.body.velocity.y = -150
		}
		last_is_space_pressed = is_space_pressed;

		/* change animation according to velocity */
		if (player.body.velocity.y < 0)
		{
			player.animations.play('fly', 17, true);
		}
		else
		{
			player.animations.stop('fly');
			player.frame = 0;
		}
	}

	this.nextScreen = function() {
		if(false) {
			return new endScreen(game);
		}
		return null;
	}
	
}