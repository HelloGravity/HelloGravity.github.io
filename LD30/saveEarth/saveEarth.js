function saveEarth(game) {
	var isDead = false;
	var player, earth;
	var lastShooting;
	var bullets = [], potatos = [];
	var potatos;
	var boom;
	var centerPoint;
	var collisionGroups = {
		earth: game.physics.p2.createCollisionGroup(),
		player: game.physics.p2.createCollisionGroup(),
        bullets: game.physics.p2.createCollisionGroup(),
     	potatos: game.physics.p2.createCollisionGroup()
	};
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
				
		}, this);
		lastShooting = game.time.now;
	    centerPoint = new Phaser.Point(game.world.centerX, game.world.centerY);
	    (function spawner() {
			if(isDead)return;
			addPotato();
			setTimeout(spawner, 300);
		})();

				
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
		if(potatos.length > 4)
			return;
		var potatoId = game.rnd.between(1,4);
		var angle = game.rnd.angle()/180*Math.PI;

        var potato = game.add.sprite(game.world.centerX + 600 * Math.cos(angle), game.world.centerY + 600 * Math.sin(angle), 'tomars-potato' + potatoId);

		potato.scale.x = potato.scale.y = 0.2;
		
   		potato.rotation = game.rnd.angle()/180*Math.PI;
		game.physics.p2.enable(potato, false);
		potato.body.clearShapes();
		potato.body.loadPolygon('tomars-physicsdata', 'potato' + potatoId, potato.scale.x, potato.scale.y);

		potato.body.velocity.x = -160 * Math.cos(angle);
		potato.body.velocity.y = -160 * Math.sin(angle);

        potato.body.collideWorldBounds = false;
		potato.body.setCollisionGroup(collisionGroups.potatos);
		
		potato.body.collides([collisionGroups.player,collisionGroups.bullets, collisionGroups.earth]);
		potatos.push(potato);
	}
	this.cleanup = function() {
	}
	this.update = function() {
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