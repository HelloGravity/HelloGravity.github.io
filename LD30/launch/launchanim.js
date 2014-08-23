function launchanim(game) {
	this.init = function() {
		console.log('aha')
		var anim0 = game.add.sprite(800, 600, 'launchanim0');
		anim0.animations.add('run0');
		anim0.animations.play('run0', 24, true);
	}
	this.cleanup = function() {
	}
	this.update = function() {
		if(anim0.isFinished()) {
//			anim0.destroy();
		//	var anim1 = game.add.sprite(800, 600, 'launchanim1');
		//	anim1.animations.add('run1');
		//	anim1.animations.play('run1', 24, false);

		}
	}

	this.nextScreen = function() {
		return null;
	}
}