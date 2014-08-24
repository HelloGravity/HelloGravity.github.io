function saveEarth(game) {
	var player, earth;
	this.init = function() {
		earth = game.add.sprite(0,0,'saveearth-earthfight');
		player = game.add.sprite(game.world.centerX, game.world.centerY,'saveearth-spaceship');
		game.physics.p2.enable(player, false);
		player.body.clearShapes();
		player.body.loadPolygon('saveearth-physicsdata', 'spaceship');
	}
	this.cleanup = function() {
	}
	this.update = function() {
		player.body.angularVelocity = 0;
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			player.body.angularVelocity -= 3.3;

		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			player.body.angularVelocity += 3.3;
	}
	this.nextScreen = function() {
		return null;
	}

	this.getPlayer = function() {return player};
}