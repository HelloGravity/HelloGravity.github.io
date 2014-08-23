function toMars(game) {
	var isBoom = false;
	var isPressedSpace = false;
	var isActive = false;
	var that = this;
	var player;
	var potatos= [];
	var earth;
	this.init = function() {
		isActive = true;

		background = game.add.sprite(0,0, 'tomars-background');
		earth = game.add.sprite(0,game.height, 'tomars-earth');
		earth.anchor.setTo(0,1);
		mars = game.add.sprite(game.width + 300,game.height, 'tomars-mars');
		mars.anchor.setTo(1,1);
		player = game.add.sprite(200, 400, 'tomars-spaceship');
		game.physics.arcade.enable(player);
		player.body.collideWorldBounds = true;
		player.anchor.setTo(0.5, 0.5);
		player.rotation = Math.PI / 2;
		player.scale.set(-0.4,0.4);
		(function spawner() {
			if(isActive) {
				if(!isBoom)
					that.spawnPotato();
				setTimeout(spawner, 300);
			}
		})();
	}
	this.cleanup = function() {
		player.destroy();
		earth.destroy();
		isActive = false;
		for (var i = potatos.length - 1; i >= 0; i--) {
			potatos[i].destroy();
		};
	}
	this.update = function() {
		if(isBoom) {
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
				isPressedSpace = true;
			return;
		}
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			player.rotation -= 0.052;
		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			player.rotation += 0.052;
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

		_.forEach(potatos, function(potato) {
			game.physics.arcade.collide(potato, potatos);
			game.physics.arcade.collide(player, potato, function() {
				var boom = game.add.sprite((player.position.x + potato.position.x)/2,(player.position.y + potato.position.y)/2, 'tomars-boom');
				boom.anchor.setTo(0.5,0.5);
				_.forEach(potatos, function(potato) {
					potato.body.velocity.x = potato.body.velocity.y = 0;
					potato.body.acceleration.x = potato.body.acceleration.y = 0;
					player.body.velocity.x = player.body.velocity.y = 0;
				});
				isBoom = true;
			});
		});

		if(Phaser.Rectangle.intersects(earth.getBounds(),game.camera.bounds))
			earth.x -= 0.1;
		else if (mars.x > game.width)
			mars.x -= 0.1;
	}

	this.spawnPotato = function() {
		if(potatos.length > 7)
			return;
		var inner = game.rnd.angle()/180*Math.PI, outer = game.rnd.angle()/180*Math.PI;
		var beginningX = game.world.centerX + 1000*Math.cos(outer), beginningY = game.world.centerY + 1000*Math.sin(outer);
		var directionX = game.world.centerX + 300*Math.cos(inner), directionY = game.world.centerY + 300*Math.sin(inner);
		var potato = game.add.sprite(beginningX, beginningY, 'tomars-potato'+game.rnd.between(1,4));
		game.physics.arcade.enable(potato);
		potato.rotation = game.rnd.angle()/180*Math.PI;
		potato.anchor.setTo(0.5, 0.5);
		potato.scale.x = potato.scale.y = (game.rnd.frac()*0.7+0.3) * 0.4;
		var velocityFactor = 0.04*(game.rnd.frac()*0.4+0.6);
		var speed = Math.sqrt((directionX - beginningX)*velocityFactor * (directionX - beginningX)*velocityFactor + (directionY - beginningY)*velocityFactor*(directionY - beginningY)*velocityFactor);
		game.physics.arcade.accelerateToXY(potato, directionX, directionY, speed, 3*speed, 3*speed); 
		potatos.push(potato);
	}

	this.nextScreen = function() {
		if(isPressedSpace) {
			return new toMars(game);
		}
		return null;
	}

	this.getPlayer = function() {
		return player;
	}
	this.getPotatos = function() {
		return potatos;
	}

}