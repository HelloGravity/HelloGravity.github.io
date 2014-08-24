function menu(game) {
	var isMenu = false, isPressedGame = false, isPressedCredits = false, isCredits = false;
	var credits, creditpressed, gamepressed, menu;
	var button1rect, button2rect;
	var goingToGame = false;
	this.init = function() {
		creditpressed = game.add.sprite(0,0, 'menu-creditpressed');
		gamepressed = game.add.sprite(0,0, 'menu-gamepressed');
		credits = game.add.sprite(0,0, 'menu-credits');
		menu = game.add.sprite(0,0, 'menu-menu');
		isMenu = true;
		button1rect = new Phaser.Rectangle(128,415,194,101);
		button2rect = new Phaser.Rectangle(493,415,194,101);
	}
	this.cleanup = function() {
		creditpressed.destroy();
		gamepressed.destroy();
		menu.destroy();
		credits.destroy();
	}
	this.update = function() {
		if(isMenu) {
		    if (game.input.mousePointer.isDown)
		    {
		        if(button1rect.contains(game.input.mousePointer.x, game.input.mousePointer.y)) {
        			isMenu = false;
        			isPressedGame = true;
        			gamepressed.bringToTop();
		        }
		        if(button2rect.contains(game.input.mousePointer.x, game.input.mousePointer.y)) {
        			isMenu = false;
        			isPressedCredits = true;
        			creditpressed.bringToTop();
		        }
		    }
		} else if(isPressedGame) {
			if(!game.input.mousePointer.isDown) {
				if(button1rect.contains(game.input.mousePointer.x, game.input.mousePointer.y)) {
        			goingToGame = true;
        		}
			}
		} else if(isPressedCredits) {
			if(!game.input.mousePointer.isDown) {
				isPressedCredits = false;
    			isCredits = true;
    			credits.bringToTop();
        	}
		}  else if (isCredits) {
			if(game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
				isCredits = false;
				isMenu = true;
				menu.bringToTop();
			}
		}
	}
	this.nextScreen = function() {
		if(goingToGame)
			return new toMars(game);
		return null;
	}
}