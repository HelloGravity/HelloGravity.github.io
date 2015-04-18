function the_game(game) {
	var BOOMERANG_RADIUS = 100;

	var player;
	var ground;
	var boomerang;
	var boomerang_coordinate;
	var last_velocity = 0;
	var current_velocity = 0;
	var rainbows = [];

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
	
	function create_boomerang_coordinate()
	{

	}

	function create_boomerang()
	{
		boomerang = game.add.sprite(72,72, 'meow-the-cat');
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
		/* add rainbows */
		var new_rainbow = game.add.sprite(1,7, 'rainbow');
		game.physics.enable(new_rainbow, Phaser.Physics.ARCADE);
		new_rainbow.x = x;
		new_rainbow.y = y;
		new_rainbow.body.velocity.x = player.scale.x * 60;
		rainbows.push(new_rainbow);
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
		boomerang.bringToTop();
	}

	function do_boomerang_coordinate()
	{
		var difX = game.input.x - player.x;
		var difY = game.input.y - player.y;
		var difAbs = Math.sqrt(difX*difX+difY*difY);
		boomerang_coordinate.x = player.x + BOOMERANG_RADIUS * difX/difAbs;
		boomerang_coordinate.y = player.y + BOOMERANG_RADIUS * difY/difAbs;
	}

	this.init = function() {
		game.stage.backgroundColor = 0x8888FF;

		create_ground();
		create_player();
		create_boomerang();
		create_boomerang_coordinate();

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

		do_rainbow();
		do_meow();
		do_boomerang();
		do_boomerang_coordinate();
	}

	this.nextScreen = function() {
		if(false) {
			return new endScreen(game);
		}
		return null;
	}

	
}