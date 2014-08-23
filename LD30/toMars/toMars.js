function toMars(game) {
	var that = this;
	var isActive = false;
	var player;
	var potatos= [];
	this.init = function() {
		isActive = true;
		player = game.add.sprite(200, 400, 'tomars-spaceship');
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5, 0.5);
		player.rotation = Math.PI / 2;
		player.scale.set(-0.4,0.4);
		function spawner() {
			if(isActive) {
				that.spawnPotato();
				setTimeout(spawner, 300);
			}
		}
		spawner();
	}
	this.cleanup = function() {
		game.load.removeAll();
		player.destroy();
		isActive = false;
		for (potato in potatos) {
			potato.destroy();
		};
	}
	this.update = function() {
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			player.rotation -= Math.PI / 140;
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			player.rotation += Math.PI / 140;
		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			player.y -= 5*Math.cos(player.rotation);
			player.x += 5*Math.sin(player.rotation);
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			player.y += 5*Math.cos(player.rotation);
			player.x -= 5*Math.sin(player.rotation);
		}
	}

	this.spawnPotato = function() {
		var inner = game.rnd.angle()/180*Math.PI, outer = game.rnd.angle()/180*Math.PI;
		var beginningX = game.world.centerX + 1000*Math.cos(outer), beginningY = game.world.centerY + 1000*Math.sin(outer);
		var directionX = game.world.centerX + 300*Math.cos(inner), directionY = game.world.centerY + 300*Math.sin(inner);
		var potato = game.add.sprite(beginningX, beginningY, 'tomars-potato'+game.rnd.between(1,4));
		game.physics.arcade.enable(potato);
		potato.anchor.setTo(0.5, 0.5);
		potato.scale.set(0.4,0.4);
		potato.body.velocity.x = (directionX - beginningX)/10;
		potato.body.velocity.y = (directionY - beginningY)/10;
		potatos.push(potato);
	}

	this.nextScreen = function() {
		return null;
	}

	this.getPlayer = function() {
		return player;
	}
	this.getPotatos = function() {
		return potatos;
	}

}