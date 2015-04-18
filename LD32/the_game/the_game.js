function the_game(game) {
	var player;
	var rainbows = [];

	this.init = function() {
		player = game.add.sprite(72,72, 'meow-the-cat');
		player.animations.add('fly');
		player.x = 30
		player.y = 500
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.gravity.y = 320;
		this.player = player;

		this.player.body.collideWorldBounds = true;

		/* handle spacebar */
		game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(function() {
			player.body.velocity.y = -300;
		}, this);

		/* handle rainbow presses */
		game.input.keyboard.addKey(Phaser.Keyboard.C).onDown.add(function() {
			rainbows.push
		}, this);
	}
	this.cleanup = function() {
		game.input.keyboard.removeKey(Phaser.Keyboard.SPACEBAR);
		game.input.keyboard.removeKey(Phaser.Keyboard.C);
		if(player) player.destroy();
	}
	this.update = function() {
		/* handle rainbow key presses */
		 game.input.keyboard.isDown(Phaser.Keyboard.C)
	
		/* change meow's animation according to velocity */
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