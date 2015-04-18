function the_game(game) {
	var player;

	this.init = function() {
		player = game.add.sprite(36,36, 'meow-the-cat');
		player.animations.add('fly');
		player.animations.play('fly');
		this.player = player;
	}
	this.cleanup = function() {
		if(player) player.destroy();
	}
	this.update = function() {
	}

	this.nextScreen = function() {
		if(false) {
			return new endScreen(game);
		}
		return null;
	}
	
}