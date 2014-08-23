function toMars(game) {
	this.player;
	this.init = function() {
		player = game.add.sprite(200, 400, 'tomars-spaceship');
		game.physics.arcade.enable([player]);
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5, 0.5);
		player.rotation = Math.PI / 2;
		player.scale.set(0.4,0.4);
	}
	this.cleanup = function() {
		game.load.removeAll();
		player.destory();
	}
	this.update = function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			player.rotation -= Math.PI / 180;
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			player.rotation += Math.PI / 180;
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			player.y -= 5*Math.cos(player.rotation);
			player.x += 5*Math.sin(player.rotation);
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			player.y += 5*Math.cos(player.rotation);
			player.x -= 5*Math.sin(player.rotation);
		}
	}

	this.nextScreen = function() {
		return null;
	}
}