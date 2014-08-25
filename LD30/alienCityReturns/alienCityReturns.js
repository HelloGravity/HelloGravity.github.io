function alienCityReturns(game) {
	var background, player, ground, missionTitle;
	var isTaklking = false, isLeaving = false, isEnded = false, isPressedSpace = false;
	var facing = '';
	var jumpTimer = 0;
	var isGravity = false;
	var isEnded = false;
	var spacebar, text1,text2, text3;
	var last = false;
	var step = 0;
	var time = game.time.now;
	this.init = function() {
		missionTitle = game.add.sprite(0,0,'aliencityreturns-missiontitle')
		text1 = game.add.sprite(921,157, 'aliencityreturns-alienbacktext1');
		text2 = game.add.sprite(791,120, 'aliencityreturns-alienbacktext2');
		text3 = game.add.sprite(852,158, 'aliencityreturns-alienbacktext3');
		spacebar = game.add.sprite(743,0, 'tomars-tocontinue');
		background = game.add.sprite(0,0, 'aliencity-marscity');
		
		ground = game.add.sprite(0,600-68, 'aliencity-ground');
   	  	game.physics.enable(ground, Phaser.Physics.ARCADE);
   	  	ground.body.immovable = true;
   	  	ground.body.moves = false;
		player = game.add.sprite(308,417, 'landedmars-astrowalk');
		player.anchor.setTo(4.5,0)
   	 	game.physics.enable(player, Phaser.Physics.ARCADE);

   	 	player.animations.add('right', [0, 1, 2, 3], 10, true);
    	player.animations.add('left', [4, 5, 6, 7], 10, true);
    	game.camera.bounds.setTo(0, 0, 1543, 600);

    	game.camera.follow(player);
    	game.physics.arcade.gravity.y = 1500;
	}
	this.cleanup = function() {
		if(player)player.destroy();
		if(text1)text1.destroy();
		if(text2)text2.destroy();
		if(text3)text3.destroy();
		if(background)background.destroy();
		if(spacebar)spacebar.destroy();
		if(ground)ground.destroy();
		if(missionTitle)missionTitle.destroy();
		game.camera.bounds.setTo(0, 0, 800, 600);
	}
	this.update = function() {
		game.physics.arcade.collide(player, ground);
		 player.body.velocity.x = 0;

		 if(isTaklking) {
		 	spacebar.bringToTop();
			var now = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
			if(step == 0)
				text1.bringToTop();
			if(last && !now) {
				step++;
				if (step == 1) {
					if(text1) {
						text1.destroy();
						text1 = undefined;
					}
					text2.bringToTop();
				} else if (step == 2) {
					if(text2) {
						text2.destroy();
						text2 = undefined;
					}
					text3.bringToTop();
				} else if (step == 3) {
					if(text3) {
						text3.destroy();
						text3 = undefined;
					}
					if(spacebar) {
						spacebar.destroy();
						spacebar = undefined;
						isTaklking = false;
						isLeaving = true;
					}
				}
			}
			last = now;
			return;
		}
		 if(!isTaklking) {
		 	 if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT)) {
	        	player.body.velocity.x = -150;
	        	if (facing != 'left') {
	            	player.animations.play('left');
	            	facing = 'left';
	       		}
	    	}
	    	else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)) {
	        	player.body.velocity.x = 150;
	        	if (facing != 'right') {
	            	player.animations.play('right');
	            	facing = 'right';
	        	}
	    	}
	    	else {
	        	if (facing != 'idle') {
	            	player.animations.stop();
	            	if (facing == 'left') {
	                	player.frame = 4;
	            	} else {
	                player.frame = 0;
	            	}
	            	facing = 'idle';
	       		}
	   		}
	    	if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && game.time.now > jumpTimer) {
	        	player.body.velocity.y = -500;
	        	jumpTimer = game.time.now + 750;
	    	}
		}
	   
	    if(player.x > 1480)
	    	player.x = 1480;
	    if(!isLeaving && player.x < 295)
	    	player.x = 295;
	     if(player.x > 1180 && !isTaklking && !isLeaving) {
	    	isTaklking = true;
	    	facing = 'idle';
	    	player.animations.stop();
	    	player.frame = 0;
    	}
    	if(player.x < 285 && isLeaving && !isEnded) {
    		isEnded = true;
    		last = false;
    		missionTitle.bringToTop();
    		time = game.time.now;
    	}
    	if(isEnded) {

    		var now = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    		if(game.input.keyboard.justReleased(Phaser.Keyboard.SPACEBAR) && game.time.now - time > 500) {
    			isPressedSpace = true;
    		}
    		last = now;
    	}
	}

	this.nextScreen = function() {
		if(isPressedSpace)
			return new saveEarth(game, true);
		return null;
	}
	
}