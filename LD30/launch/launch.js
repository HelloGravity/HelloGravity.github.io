function launch(game) {
	var time = 0;
	var stepBeginTime;
	var step = 0;
	var lastIsPressed;

	var spacebar;
	var background;
	var spaceship;	
	var number;
	var potato;
	this.init = function() {
		spacebar = game.add.sprite(0,0, 'launch-space');
		nextSlide();
	}
	this.cleanup = function() {
		if(background)
			background.destroy();
		if(spacebar)
			spacebar.destroy();
		if(spaceship)
			spaceship.destroy();
		if(number)
			number.destroy();
		if(potato)
			potato.destroy();
	}
	this.update = function() {
		if(!game.paused)
			time += game.time.elapsed/1000;
		var isPressed = game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
		if(!isPressed && lastIsPressed && step < 6)
			nextSlide();
		lastIsPressed = isPressed;
		if(step >= 6 && step < 11 && time - stepBeginTime > 1)
			nextSlide();
		if (step >= 11) {
			spaceship.y -= 2*(time-stepBeginTime);
		}
	}

	this.nextScreen = function() {
		if(spaceship && spaceship.y < -300)
			return new toMars(game);
		return null;
	}
	function nextSlide() {
		step++;
		if(step <= 6) {
			if(background) {
				background.destroy();
				background = undefined;
			}
			if(step != 6)
				background = game.add.sprite(0,0, 'launch-launch' + step);
			else
				background = game.add.sprite(0,0, 'launch-launch1');
			spacebar.bringToTop();
		}
		if(step >= 6 && step <= 10) {
			if(spacebar) {
				spacebar.destroy();
				spacebar = undefined;
			}
			if(number) {
				number.destroy();
				number = undefined;
			}
			number = game.add.sprite(300,100, 'launch-' + (11-step));
		}
		if(step == 11) {
			if(background) {
				background.destroy();
				background = undefined;
			}
			background = game.add.sprite(0,0, 'launch-launch6');
			if(number) {
				number.destroy();
				number = undefined;
			}
			if(!potato) {
				potato = game.add.sprite(300,100, 'launch-potato');
			}
			if(!spaceship) {
				spaceship = game.add.sprite(587,268, 'launch-spaceship');
			}
		}
		stepBeginTime = time;
	}
}