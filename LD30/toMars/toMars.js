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
		(function spawner() {
			if(isActive) {
				that.spawnPotato();
				setTimeout(spawner, 300);
			}
		})();
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
		
		var index = potatos.length;
		while(index--) {
			var potato = potatos[index];
			if(Phaser.Rectangle.intersects(potato.getBounds(),game.camera.bounds))
				potato.alreadySeen = true;
			else if(potato.alreadySeen == true) {
				potato.destroy();
				potatos.splice(index, 1);
			}
		}
		/*
		var seenPotatos = _.where(potatos,"alreadySeen");
		_.forEach(seenPotatos, function(potato) {
			game.physics.arcade.collide(potato, seenPotatos);
		});
*/
		_.forEach(potatos, function(potato) {
			game.physics.arcade.collide(potato, potatos);
		});
	}

	this.spawnPotato = function() {
		if(potatos.length > 10)
			return;
		var inner = game.rnd.angle()/180*Math.PI, outer = game.rnd.angle()/180*Math.PI;
		var beginningX = game.world.centerX + 1000*Math.cos(outer), beginningY = game.world.centerY + 1000*Math.sin(outer);
		var directionX = game.world.centerX + 300*Math.cos(inner), directionY = game.world.centerY + 300*Math.sin(inner);
		var potato = game.add.sprite(beginningX, beginningY, 'tomars-potato'+game.rnd.between(1,4));
		game.physics.arcade.enable(potato);
		potato.anchor.setTo(0.5, 0.5);
		potato.scale.x = potato.scale.y = (game.rnd.frac()*0.7+0.3) * 0.4;
		var velocityFactor = 0.07*(game.rnd.frac()*0.4+0.6);
		var speed = Math.sqrt((directionX - beginningX)*velocityFactor * (directionX - beginningX)*velocityFactor + (directionY - beginningY)*velocityFactor*(directionY - beginningY)*velocityFactor);
		game.physics.arcade.accelerateToXY(potato, directionX, directionY, speed, 3*speed, 3*speed); 
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