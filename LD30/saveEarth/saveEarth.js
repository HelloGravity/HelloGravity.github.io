function saveEarth(game, noInstructions) {
	var potatosRemaining = 47;
	var isDead = false;
	var isStartedGame = false;
	var player, earth;//
	var lastShooting;
	var bullets = [], potatos = [];//
	var potatos;//
	var boom;//
	var centerPoint;
	var instructions;//
	var text;//
	var spaceBarPlan;//
	var collisionGroups = {
		earth: game.physics.p2.createCollisionGroup(),
		player: game.physics.p2.createCollisionGroup(),
        bullets: game.physics.p2.createCollisionGroup(),
     	potatos: game.physics.p2.createCollisionGroup()
	};

	this.cleanup = function() {
		if(player)player.destroy();
		if(earth)earth.destroy();
		_.forEach(potatos, function (potato) {potato.destroy();});
		_.forEach(bullets, function (bullet) {bullet.destroy();});
		if(boom)boom.destroy();
		if(instructions)instructions.destroy();
		if(text)text.destroy();
		if(spaceBarPlan)spaceBarPlan.destroy();
	}

	this.init = function() {
		game.physics.p2.setImpactEvents(true);
		earth = game.add.sprite(game.world.centerX, game.world.centerY,'saveearth-earthfight');
		game.physics.p2.enable(earth, false);
		earth.body.setCircle(46);
		earth.body.setCollisionGroup(collisionGroups.earth);
		earth.body.collides(collisionGroups.potatos, function(earthBody,potato) {
			isDead = true;
			boom = game.add.sprite((earthBody.x*0.4 + potato.x*0.6),(earthBody.y*0.4 + potato.y*0.6), 'tomars-boom');
			boom.anchor.setTo(0.5,0.5);
			spaceBarPlan = game.add.sprite(200,520, 'tomars-spacebar');
		}, this);

		player = game.add.sprite(game.world.centerX, game.world.centerY,'saveearth-spaceship');
		game.physics.p2.enable(player, false);
		player.body.clearShapes();
		player.body.loadPolygon('saveearth-physicsdata', 'spaceship');
		player.body.setCollisionGroup(collisionGroups.player);
		player.body.collides(collisionGroups.potatos, function(playerBody,potato) {
			isDead = true;		
			boom = game.add.sprite((player.position.x*0.4 + potato.x*0.6),(player.position.y*0.4 + potato.y*0.6), 'tomars-boom');
			boom.anchor.setTo(0.5,0.5);
			spaceBarPlan = game.add.sprite(200,520, 'tomars-spacebar');
		}, this);
		lastShooting = game.time.now;
	    centerPoint = new Phaser.Point(game.world.centerX, game.world.centerY);
	    (function spawner() {
			if(isDead)return;
			if(isStartedGame)addPotato();
			setTimeout(spawner, 300);
		})();
		if(!noInstructions)
			instructions = game.add.sprite(0,0,'saveearth-instructions');
 	}

	function addBullet() {
		var angle = player.body.angle * Math.PI / 180 - Math.PI/2;
			
        var bullet = game.add.sprite(game.world.centerX + player.height / 2 * Math.cos(angle), game.world.centerY + player.height / 2 * Math.sin(angle), 'saveearth-bullet');
		game.physics.p2.enable(bullet, true);		

		bullet.scale.x = bullet.scale.y = 0.3;
		bullet.body.setCircle(bullet.width / 2 * 0.3);
		bullet.body.velocity.x = 500 * Math.cos(angle);
		bullet.body.velocity.y = 500 * Math.sin(angle);

        bullet.body.collideWorldBounds = false;
		bullet.body.setCollisionGroup(collisionGroups.bullets);
		bullet.body.collides(collisionGroups.potatos, function(bulletBody, potatoBody) {
			_.remove(potatos, function (potato) {
				if(potato.body == potatoBody) {
					potato.destroy();
					potatosRemaining--;
					return true;
				}
				return false;
			});
			bullet.destroy();
			_.pull(bullets, bullet);
		}, this);
		bullets.push(bullet);
	}

	function addPotato() {
		if(potatos.length > 4 || potatosRemaining - potatos.length <= 0)
			return;
		var potatoId = game.rnd.between(1,4);
		var angle = game.rnd.angle()/180*Math.PI;

        var potato = game.add.sprite(game.world.centerX + 600 * Math.cos(angle), game.world.centerY + 600 * Math.sin(angle), 'tomars-potato' + potatoId);

		potato.scale.x = potato.scale.y = 0.2*(0.4 + 0.6*game.rnd.frac());
		
   		potato.rotation = game.rnd.angle()/180*Math.PI;
		game.physics.p2.enable(potato, false);
		potato.body.clearShapes();
		potato.body.loadPolygon('tomars-physicsdata', 'potato' + potatoId, potato.scale.x, potato.scale.y);

		var randomVelFactor = 160 * (0.4 + 0.6*game.rnd.frac());
		potato.body.velocity.x = -randomVelFactor * Math.cos(angle);
		potato.body.velocity.y = -randomVelFactor * Math.sin(angle);

        potato.body.collideWorldBounds = false;
		potato.body.setCollisionGroup(collisionGroups.potatos);
		
		potato.body.collides([collisionGroups.player,collisionGroups.bullets, collisionGroups.earth]);
		potatos.push(potato);
	}
	
	this.update = function() {

		if(!isStartedGame) {
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) || noInstructions) {
				if(instructions) {
					instructions.destroy();
					instructions = undefined;
				}
				isStartedGame = true;
    			var style = { font: "25px Arial", fill: "#ffffff", align: "Right" };
				text = game.add.text(game.world.centerX-300, 0, "", style);
			}
			return;
		}
		text.text = "Remaining Potatos :\n" + (potatosRemaining);

		_.remove(bullets,  function(bullet) {
			if(Phaser.Point.distance(centerPoint, bullet) > 550) {
				bullet.destroy();
				return true;//remove
			}
			return false;
		});
		if(isDead) {
			_.forEach(bullets, stopMoving);
			_.forEach(potatos, stopMoving);
			stopMoving(player);
			stopMoving(earth);
			return;
		}
		player.body.angularVelocity = 0;
		if(game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
			player.body.angularVelocity -= 3.5;

		if(game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
			player.body.angularVelocity += 3.5;

		if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && game.time.now - lastShooting > 200) {
			lastShooting = game.time.now;
			addBullet();
		}
	}

	this.nextScreen = function() {
		if(potatosRemaining == 0) {
			return new endScreen(game);
		} else if (isDead && game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR)) {
			return new saveEarth(game, false);
		}
		return null;
	}

	this.getPlayer = function() {return player};


	function stopMoving(item) {
		item.body.velocity.x = 
		item.body.velocity.y = 
		item.body.force.x = 
		item.body.force.y = 
		item.body.angularVelocity = 
		item.body.angularForce = 0;
	}
}