function toMars(game) {
	var player;
	this.init = function() {
		//game.load.image('background', 'toMars/background.png');
		game.load.image('spaceship', 'toMars/spaceship.png');
		//game.load.image('potato1', 'toMars/potato1.png');
		//game.load.image('potato2', 'toMars/potato2.png');
		//game.load.image('potato3', 'toMars/potato3.png');
		//game.load.image('potato4', 'toMars/potato4.png');

		player = game.add.sprite(200, 400, 'spaceship');
		game.physics.arcade.enable([player]);
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5, 0.5);
		player.rotation = Math.PI / 2;
	}
	this.cleanup = function() {
		game.load.removeAll();
		player.destory();
	}
	this.update = function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			player.rotation += Math.PI / 180 / 3;
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			player.rotation -= Math.PI / 180 / 3;
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			player.x += 10*Math.cos(player.rotation);
			player.y += 10*Math.sin(player.rotation);
		}

	}

	this.nextScreen = function() {
		return null;
	}
}