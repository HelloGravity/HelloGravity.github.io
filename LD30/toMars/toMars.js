function toMars(game) {
	var isBoom = false, isPressedSpace = false, isActive = false, isStartedGame = false, isGrandFinale = false, isGrandBoom = false, isScreenFinished = false;
	var background, player, potatos= [], earth, boom, spaceBarPlan, instructions, pressToContinue;
	var screenCenter;
	var lastPressedSpace;
	var grandPotato;
	this.init = function() {
		isActive = true;
		isStartedGame = false;
		screenCenter = new Phaser.Point(game.world.centerX,game.world.centerY);
		background = game.add.sprite(0,0, 'tomars-background');
		earth = game.add.sprite(0,game.height, 'tomars-earth');
		earth.anchor.setTo(0,1);
		mars = game.add.sprite(game.width + 300,game.height, 'tomars-mars');
		mars.anchor.setTo(1,1);
		player = game.add.sprite(200, 400, 'tomars-spaceship');
		player.anchor.setTo(0.5, 0.5);
		player.scale.set(0.4,0.4);
		game.physics.p2.enable(player, false);	
		player.body.clearShapes();
		player.body.loadPolygon('tomars-physicsdata', 'spaceship', 0.4);
		player.body.angle = 90;
		(function spawner() {
			if(isActive) {
				if(!isBoom && isStartedGame)
					spawnPotato();
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
			else if (body == grandPotato.body) {
				isGrandBoom = true;
				boom = game.add.sprite(player.position.x*0.8 + grandPotato.position.x*0.2,player.position.y*0.8 + grandPotato.position.y*0.2, 'tomars-boom');
				boom.scale.x = boom.scale.y = 2;
				boom.anchor.setTo(0.5,0.5);
				pressToContinue = game.add.sprite(0,0, 'tomars-tocontinue');
			}
		}, this);
		instructions = game.add.sprite(0, 0, 'tomars-instructions');
	}
	this.cleanup = function() {
		player.destroy();
		earth.destroy();
		background.destroy();
		_.forEach(potatos, function (potato) {
			potato.destroy();
		});
		if(spaceBarPlan)
			spaceBarPlan.destroy();
		if(boom)
			boom.destroy();

		if(instructions)
			instructions.destroy();
		if(grandPotato)
			grandPotato.destroy();
		if(pressToContinue)
			pressToContinue.destroy();
		isActive = false;
	}

	this.update = function() {
		var spacePressed = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);

		if(!isStartedGame) {
			if(lastPressedSpace && !spacePressed) {
				isStartedGame = true;
				if(instructions) {
					instructions.destroy();
					instructions = undefined;
				}
			}
			lastPressedSpace = spacePressed;
			return;
		}
		if(isBoom) {
			_.forEach(potatos, stopMoving);
			stopMoving(player);

			if(lastPressedSpace && !spacePressed)
				isPressedSpace = true;
			lastPressedSpace = spacePressed;
			return;
		}
		if(isGrandFinale && isGrandBoom) {
			_.forEach(potatos, stopMoving);
			stopMoving(player);
			stopMoving(grandPotato);
			if(lastPressedSpace && !spacePressed)
				isScreenFinished = true;
			lastPressedSpace = spacePressed;
			return;
		}
		player.body.velocity.x = 0;
		player.body.velocity.y = 0;
		player.body.angularVelocity = 0;
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			player.body.angularVelocity -= 3.3;

		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			player.body.angularVelocity += 3.3;

		if(game.input.keyboard.isDown(Phaser.Keyboard.UP)) {
			player.body.velocity.y -= 500*Math.cos(player.rotation);
			player.body.velocity.x += 500*Math.sin(player.rotation);
		}	
		if(game.input.keyboard.isDown(Phaser.Keyboard.DOWN)) {
			player.body.velocity.y += 500*Math.cos(player.rotation);
			player.body.velocity.x -= 500*Math.sin(player.rotation);
		}
		player.body.x = Phaser.Math.clamp(player.body.x, 0, game.width);
		player.body.y = Phaser.Math.clamp(player.body.y, 0, game.height);

		_.remove(potatos, function(potato) {
			if(Phaser.Rectangle.intersects(potato.getBounds(),game.camera.bounds))
				potato.alreadySeen = true;
			if((potato.alreadySeen && !Phaser.Rectangle.intersects(potato.getBounds(),game.camera.bounds)) || Phaser.Point.distance(potato.position, screenCenter) > 700) {
				potato.destroy();
				return true;//remove
			}
			potato.body.force.x = potato._data.forceX;
			potato.body.force.y = potato._data.forceY;
			return false;
		});

		if(Phaser.Rectangle.intersects(earth.getBounds(),game.camera.bounds))
			earth.x -= 0.1;
		else if (mars.x > game.width)
			mars.x -= 0.1;
		

		if(mars.x <= game.width) {
			isGrandFinale = true;
		}
		if(isGrandFinale && grandPotato) {
		    grandPotato.body.rotation = Math.atan2(player.y - grandPotato.y, player.x - grandPotato.x);
		    grandPotato.body.velocity.x = Math.cos(grandPotato.body.rotation) * 1130;  
		    grandPotato.body.velocity.y = Math.sin(grandPotato.body.rotation) * 1130;
		}

		
	}

	this.nextScreen = function() {
		if(isPressedSpace) {
			return new toMars(game);
		} else if (isScreenFinished) {
			return new saveEarth(game);
		}
		return null;
	}

	this.getPlayer = function() {
		return player;
	}
	this.getPotatos = function() {
		return potatos;
	}

	function spawnPotato() {
		if(isGrandFinale) {
			if(!grandPotato && potatos.length == 0) {
				var inner = game.rnd.angle()/180*Math.PI, outer = game.rnd.angle()/180*Math.PI;
				var beginning = new Phaser.Point(game.world.centerX + 700*Math.cos(outer), game.world.centerY + 700*Math.sin(outer));
				grandPotato = game.add.sprite(beginning.x, beginning.y, 'tomars-grandpotato');
				grandPotato.anchor.setTo(0.5, 0.5);
				game.physics.p2.enable(grandPotato, false);
			}
			return;	
		}

		if(potatos.length > 7)
			return;

		var potatoId = game.rnd.between(1,4);
		var inner = game.rnd.angle()/180*Math.PI, outer = game.rnd.angle()/180*Math.PI;
		var beginning = new Phaser.Point(game.world.centerX + 600*Math.cos(outer), game.world.centerY + 600*Math.sin(outer));
		var direction = new Phaser.Point(game.world.centerX + 300*Math.cos(inner), game.world.centerY + 300*Math.sin(inner));
		
		var potato = game.add.sprite(beginning.x, beginning.y, 'tomars-potato'+potatoId);
		potato.rotation = game.rnd.angle()/180*Math.PI;
		potato.scale.x = potato.scale.y = (game.rnd.frac()*0.7+0.3) * 0.4;
		game.physics.p2.enable(potato, false);
		potato.body.clearShapes();
		potato.body.loadPolygon('tomars-physicsdata', 'potato' + potatoId, potato.scale.x, potato.scale.y);

		var speed = (game.rnd.frac()*0.4+0.6)*0.2*Phaser.Point.distance(direction, beginning);
        var angle = Phaser.Point.angle(direction, beginning);
        
        potato._data = {
        	forceY : Math.sin(angle) * speed,
        	forceX : Math.cos(angle) * speed
        };
		potatos.push(potato);
	}

	function stopMoving(item) {
		item.body.velocity.x = 
		item.body.velocity.y = 
		item.body.force.x = 
		item.body.force.y = 
		item.body.angularVelocity = 
		item.body.angularForce = 0;
	}
}