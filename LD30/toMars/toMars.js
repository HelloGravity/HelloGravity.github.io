function toMars(game) {
	var isBoom = false;
	var isPressedSpace = false;
	var isActive = false;
	var that = this;
	var player;
	var potatos= [];
	var earth;
	var spacebar;
	var boom;
	var spaceBarPlan;

	this.init = function() {
		isActive = true;
		background = game.add.sprite(0,0, 'tomars-background');
		earth = game.add.sprite(0,game.height, 'tomars-earth');
		earth.anchor.setTo(0,1);
		mars = game.add.sprite(game.width + 300,game.height, 'tomars-mars');
		mars.anchor.setTo(1,1);
		player = game.add.sprite(200, 400, 'tomars-spaceship');
		player.anchor.setTo(0.5, 0.5);
		player.rotation = Math.PI / 2;

		player.scale.set(0.4,0.4);
		game.physics.p2.enable(player, false);	
		player.body.clearShapes();
		player.body.loadPolygon('tomars-physicsdata', 'spaceship', 0.4);
		player.body.collideWorldBounds = true;
		(function spawner() {
			if(isActive) {
				if(!isBoom)
					that.spawnPotato();
				setTimeout(spawner, 300);
			}
		})();
		player.body.onBeginContact.add(function(body, shapeA, shapeB, equation) {
			var potato = _(potatos).where({ 'body': body }).first();
			if(potato) {
				boom = game.add.sprite((player.position.x + potato.position.x)/2,(player.position.y + potato.position.y)/2, 'tomars-boom');
				boom.anchor.setTo(0.5,0.5);			
				isBoom = true;
				spaceBarPlan = game.add.sprite(200,520, 'tomars-spacebar');
			}
		}, this);

	}
	this.cleanup = function() {
		player.destroy();
		earth.destroy();
		boom.destroy();
		background.destroy();
		isActive = false;
		for (var i = potatos.length - 1; i >= 0; i--) {
			potatos[i].destroy();
		};
	}
	this.update = function() {
		if(isBoom) {
			_.forEach(potatos, function(potato) {
				potato.body.velocity.x = 
				potato.body.velocity.y = 
				potato.body.force.x = 
				potato.body.force.y = 
				potato.body.angularVelocity = 
				potato.body.angularForce = 0;
			});
			player.body.velocity.x = 
			player.body.velocity.y = 
			player.body.force.x = 
			player.body.force.y = 
			player.body.angularVelocity = 
			player.body.angularForce = 0;
			
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR))
				isPressedSpace = true;
			return;
		}
		var velX = 0;
		var velY = 0;
		var velAng = 0;
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			velAng -= 3.3;

		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			velAng += 3.3;

		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			velY -= 500*Math.cos(player.rotation);
			velX += 500*Math.sin(player.rotation);
		}	
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			velY += 500*Math.cos(player.rotation);
			velX -= 500*Math.sin(player.rotation);
		}
		player.body.velocity.x = velX;
		player.body.velocity.y = velY;
		player.body.angularVelocity = velAng;
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
			potato.body.force.x = potato._data.forceX;
			potato.body.force.y = potato._data.forceY;

			/*
			game.physics.arcade.collide(player, potato, function() {
				boom = game.add.sprite((player.position.x + potato.position.x)/2,(player.position.y + potato.position.y)/2, 'tomars-boom');
				boom.anchor.setTo(0.5,0.5);
				_.forEach(potatos, function(potato) {
					potato.body.velocity.x = potato.body.velocity.y = 0;
					potato.body.acceleration.x = potato.body.acceleration.y = 0;
					player.body.velocity.x = player.body.velocity.y = 0;
				});
				isBoom = true;
				spaceBarPlan = game.add.sprite(200,520, 'tomars-spacebar');
				
			});*/
		});

		if(Phaser.Rectangle.intersects(earth.getBounds(),game.camera.bounds))
			earth.x -= 0.1;
		else if (mars.x > game.width)
			mars.x -= 0.1;

		if(player.body.x < 0)
			player.body.x = 0;
		if(player.body.y < 0)
			player.body.y = 0;
		if(player.body.y > game.height)
			player.body.y = game.height;
		if(player.body.x > game.width)
			player.body.x = game.width;
	}

	this.spawnPotato = function() {
		if(potatos.length > 7)
			return;
		var potatoId = game.rnd.between(1,4);
		var inner = game.rnd.angle()/180*Math.PI, outer = game.rnd.angle()/180*Math.PI;
		var beginningX = game.world.centerX + 600*Math.cos(outer), beginningY = game.world.centerY + 1000*Math.sin(outer);
		var directionX = game.world.centerX + 300*Math.cos(inner), directionY = game.world.centerY + 300*Math.sin(inner);
		
		var potato = game.add.sprite(beginningX, beginningY, 'tomars-potato'+potatoId);
		potato.rotation = game.rnd.angle()/180*Math.PI;
		potato.anchor.setTo(0.5, 0.5);
		potato.scale.x = potato.scale.y = (game.rnd.frac()*0.7+0.3) * 0.4;
		game.physics.p2.enable(potato, false);
		potato.body.clearShapes();
		potato.body.loadPolygon('tomars-physicsdata', 'potato' + potatoId, potato.scale.x);

		
		var speed = (game.rnd.frac()*0.4+0.6)*0.2*Math.sqrt((directionX - beginningX) * (directionX - beginningX) + (directionY - beginningY)*(directionY - beginningY));
        var angle = Math.atan2(directionY - potato.y, directionX - potato.x);
        potato._data = {
        	forceY : Math.sin(angle) * speed,
        	forceX : Math.cos(angle) * speed
        };
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