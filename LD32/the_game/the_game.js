function the_game(game) {
	/* CONSTS */
	var BOOMERANG_RADIUS = 175;
	var BOOMERANG_SPEED = 400;
	var BOOMERANG_SPEED_BACK = 50;

	var CHICKEN_SPEED = 50;
	var EGG_SPEED = 100;

	/* GAME OBJECTS */
	var player;
	var ground;
	var boomerang;
	var aim;
	var rainbows = [];
	var chickens = [];

	/* VARIABLES */
	var last_velocity = 0;
	var current_velocity = 0;
	var is_shooting = false; // returning is still counted shooting
	var is_returning = false; 

	function create_ground()
	{
		ground = game.add.sprite(0,game.height, 'ground');
		ground.anchor.set(.5,.5)
		ground.y -= 0.5*ground.height
		ground.x += 0.5*ground.width
   	  	game.physics.enable(ground, Phaser.Physics.ARCADE);
   	  	ground.body.immovable = true;
   	  	ground.body.moves = false;
   	  	ground.body.height *= 0.2;
	}

	function create_player()
	{
		player = game.add.sprite(72,72, 'meow-the-cat');
		player.animations.add('fly');
		player.x = 200	
		player.y = 200
		player.anchor.setTo(.5,.5);
		player.scale.x = -1;
		game.physics.enable(player, Phaser.Physics.ARCADE);
		player.body.gravity.y = 320;
		this.player = player;

		this.player.body.collideWorldBounds = true;

		/* handle spacebar */
		game.input.keyboard.addKey(Phaser.Keyboard.W).onDown.add(function() {
			player.body.velocity.y = -300;
		}, this);
	}
	
	function create_aim()
	{
		aim = game.add.sprite(0,0, 'aim');
		aim.anchor.setTo(.5,.5);
	}

	function create_boomerang()
	{
		boomerang = game.add.sprite(28,28, 'boomerang');
		boomerang.animations.add('spin');
		boomerang.animations.play('spin', 13, true);
		boomerang.anchor.setTo(.5,.5);
		game.physics.enable(boomerang, Phaser.Physics.ARCADE);
		boomerang.kill(); // do not show in the beginning
	}

	function clear_all_rainbows()
	{
		_.forEach(rainbows, function(rainbow) {
		 	rainbow.destroy();
		});
		rainbows = [];
	}

	function add_rainbow(x,y)
	{
		var new_rainbow = game.add.sprite(1,7, 'rainbow');
		game.physics.enable(new_rainbow, Phaser.Physics.ARCADE);
		new_rainbow.x = x;
		new_rainbow.y = y;
		new_rainbow.body.velocity.x = player.scale.x * 60;
		rainbows.push(new_rainbow);
	}

	function add_chicken()
	{
		var new_chicken = game.add.sprite(32, 32, 'chicken');
		game.physics.enable(new_chicken, Phaser.Physics.ARCADE);
		var inner = game.rnd.angle()/180*Math.PI;
		var outer = game.rnd.angle()/180*Math.PI;

		new_chicken.x = game.world.centerX + 600*Math.max(Math.cos(outer),Math.sin(outer));
		new_chicken.y = game.world.centerY + 600*Math.min(Math.cos(outer),Math.sin(outer));
		difX = game.world.centerX + 200*Math.cos(inner) - new_chicken.x;
		difY = game.world.centerY + 200*Math.sin(inner) - new_chicken.y;
		difAbs = Math.sqrt(difX*difX + difY*difY);
		new_chicken.body.velocity.x = CHICKEN_SPEED * difX / difAbs;
		new_chicken.body.velocity.y = CHICKEN_SPEED * difY / difAbs;

		new_chicken.animations.add('run');
		new_chicken.animations.play('run', 10, true);

		if (new_chicken.body.velocity.x < 0)
			new_chicken.scale.x = -1;

        chickens.push(new_chicken);
	}

	function do_chicken()
	{
		if (chickens.length < 7)
			add_chicken();

		_(chickens).forEach().remove(function(chicken) {
			return !chicken.inCamera && 
			((chicken.x - game.world.centerX) * chicken.body.velocity.x > 0 ||
			(chicken.y - game.world.centerY) * chicken.body.velocity.y > 0);
		}).forEach(function(chicken) {
			chicken.destroy();
		}).value();
		console.log(chickens.length);
	}

	function do_rainbow()
	{
		add_rainbow(player.x + player.width * ((player.scale.x > 0) ? 0.2 : 0.27),player.body.center.y);
		_(rainbows).forEach(function(rainbow) {
		 	rainbow.alpha *= 0.95;
		}).remove(function(rainbow) {
		  return !rainbow.inCamera || rainbow.alpha < 0.01;
		}).forEach(function(rainbow) {
		 	rainbow.destroy();
		}).value();
	}

	function do_meow()
	{	
		var left_pressed = game.input.keyboard.isDown(Phaser.Keyboard.A);
		var right_pressed = game.input.keyboard.isDown(Phaser.Keyboard.D);

		last_velocity = player.body.velocity.x;
		if(left_pressed)
		{
			player.body.velocity.x = -100;
		}
		if(right_pressed)
		{
			player.body.velocity.x = 100;
		}
		if (!right_pressed && !left_pressed)
		{
			player.body.velocity.x = 0;	
		}
		current_velocity = player.body.velocity.x;

		if (current_velocity * last_velocity < 0) {
			clear_all_rainbows();
		}

		/* change meow's animation according to velocity */
		if (player.body.velocity.y < 0) {
			player.animations.play('fly', 17, true);
		}
		else {
			player.animations.stop('fly');
			player.frame = 0;
		}
		if (player.body.velocity.x > 0)
		{
			player.scale.x = -1;
		}
		if (player.body.velocity.x < 0)
		{
			player.scale.x = 1;
		}
		player.bringToTop();
	}

	function do_boomerang()
	{

		if(!is_shooting && game.input.mousePointer.justPressed())
		{
			boomerang.x = player.x;
			boomerang.y = player.y;
			is_shooting = true;
			boomerang.revive();
			
			var difX = aim.x - boomerang.x;
			var difY = aim.y - boomerang.y;
			var difAbs = Math.sqrt(difX*difX+difY*difY);
			boomerang.body.velocity.x = BOOMERANG_SPEED * difX/difAbs;
			boomerang.body.velocity.y = BOOMERANG_SPEED * difY/difAbs;
		}
		if (is_shooting) 
		{
			if (!is_returning)
			{
				//boomerang.body.velocity.x *= 0.97;
				//boomerang.body.velocity.y *= 0.97;
				var difX = aim.x - boomerang.x;
				var difY = aim.y - boomerang.y;
				if (boomerang.body.velocity.x * difX < 0 || boomerang.body.velocity.y * difY < 0)
				{
					boomerang.body.velocity.set(0,0);
					boomerang.x = aim.x;
					boomerang.y = aim.y;
					is_returning = true;
				}

			}
			else
			{
				var old_speed = Math.sqrt(
					boomerang.body.velocity.x * boomerang.body.velocity.x +
					boomerang.body.velocity.y * boomerang.body.velocity.y);
				var new_speed = (old_speed > 0) ? old_speed*1.02 : BOOMERANG_SPEED_BACK;
				var difX = player.x - boomerang.x;
				var difY = player.y - boomerang.y;
				var difAbs = Math.sqrt(difX*difX+difY*difY);
				boomerang.body.velocity.x = new_speed * difX/difAbs;
				boomerang.body.velocity.y = new_speed * difY/difAbs;

				if (difAbs < 5)
				{
					is_returning = false;
					is_shooting = false;
					boomerang.body.velocity.x = 0;
					boomerang.body.velocity.y = 0;
					boomerang.kill();
				}
			}
		}
		boomerang.bringToTop();
	}

	function do_aim()
	{
		if (is_shooting && aim.alive)
		{
			aim.kill();
		}
		if (!is_shooting && !aim.alive)
		{	
			aim.revive();
		}
		if (!is_shooting)
		{
			var difX = game.input.x - player.x;
			var difY = game.input.y - player.y;
			var difAbs = Math.sqrt(difX*difX+difY*difY);
			aim.x = player.x + BOOMERANG_RADIUS * difX/difAbs;
			aim.y = player.y + BOOMERANG_RADIUS * difY/difAbs;
		}
	}

	this.init = function() {
		game.stage.backgroundColor = 0x8888FF;

		create_ground();
		create_player();
		create_boomerang();
		create_aim();

		/* this is here only for debugging */
		this.player = player
		this.rainbows = rainbows
		this.ground = ground	
	}
	
	this.cleanup = function() {
		game.input.keyboard.removeKey(Phaser.Keyboard.W);
		clear_all_rainbows();
		if(player) player.destroy();
		game.stage.backgroundColor = 0;
	}
	
	this.update = function() {
		game.physics.arcade.collide(player, ground);

		do_chicken();
		do_rainbow();
		do_meow();
		do_boomerang();
		do_aim();
	}

	this.nextScreen = function() {
		if(false) {
			return new endScreen(game);
		}
		return null;
	}

	
}