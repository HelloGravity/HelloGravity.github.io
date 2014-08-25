function landedMars(game) {
	var background, player, ground;

	var facing = 'right';
	var jumpTimer = 0;
	var isGravity = false;
	var isEnded = false;
	var spacebar, text1,text2, text3;
	var last = false;
	var step = 0;
	this.init = function() {
		
		text1 = game.add.sprite(0,0, 'landedmars-crashtext1');
		text2 = game.add.sprite(0,0, 'landedmars-crashtext2');
		text3 = game.add.sprite(0,0, 'landedmars-crashtext3');
		background = game.add.sprite(0,0, 'landedmars-crash');
		spacebar = game.add.sprite(0,0, 'tomars-tocontinue');

		ground = game.add.sprite(-75,600-50, 'landedmars-ground');
   	  	game.physics.enable(ground, Phaser.Physics.ARCADE);
   	  	ground.body.immovable = true;
   	  	ground.body.moves = false;
		player = game.add.sprite(380,200, 'landedmars-astrowalk');
   	 	game.physics.enable(player, Phaser.Physics.ARCADE);

   	 	player.animations.add('right', [0, 1, 2, 3], 10, true);
    	player.animations.add('left', [4, 5, 6, 7], 10, true);
	}
	this.cleanup = function() {
	
	}
	this.update = function() {
		if(!isGravity) {
			var now = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
			if(last && !now) {
				step++;
				if(step == 1) {
					text1.bringToTop();
				} else if (step == 2) {
					if(text1) {
						text1.destroy();
						text1 = undefined;
					}
					text2.bringToTop();
				} else if (step == 3) {
					if(text2) {
						text2.destroy();
						text2 = undefined;
					}
					text3.bringToTop();
				} else if (step == 4) {
					if(text3) {
						text3.destroy();
						text3 = undefined;
					}
					game.physics.arcade.gravity.y = 1500;
					isGravity = true;
					if(spacebar) {
						spacebar.destroy();
						spacebar = undefined;
					}
				}
			}
			last = now;
			return;
		}
		game.physics.arcade.collide(player, ground);
		 player.body.velocity.x = 0;

	    if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT))
	    {
	        player.body.velocity.x = -150;

	        if (facing != 'left')
	        {
	            player.animations.play('left');
	            facing = 'left';
	        }
	    }
	    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT))
	    {
	        player.body.velocity.x = 150;

	        if (facing != 'right')
	        {
	            player.animations.play('right');
	            facing = 'right';
	        }
	    }
	    else
	    {
	        if (facing != 'idle')
	        {
	            player.animations.stop();

	            if (facing == 'left')
	            {
	                player.frame = 4;
	            }
	            else
	            {
	                player.frame = 0;
	            }

	            facing = 'idle';
	        }
	    }
	    if (game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR) && game.time.now > jumpTimer)
	    {
	        player.body.velocity.y = -500;
	        jumpTimer = game.time.now + 750;
	    }
	    if(player.x < 0)
	    	player.x = 0;
	    if(player.x >800)
	    	isEnded = true;
	}

	this.nextScreen = function() {
		if(isEnded)
			return new alienCity(game);
		return null;
	}
	
}