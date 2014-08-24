function endScreen(game) {
	var goingToMenu = false;
	var end;
	var last = false;
	this.init = function() {
		end = game.add.sprite(0,0, 'endscreen-theend');
	}
	this.cleanup = function() {
		end.destroy();
	}
	this.update = function() {
		var now = game.input.keyboard.isDown(Phaser.Keyboard.ESC);
		if(!now && last) {
			goingToMenu = true;
		}
		last = now;
	}
	this.nextScreen = function() {
		if(goingToMenu)
			return new menu(game);
		return null;
	}
}