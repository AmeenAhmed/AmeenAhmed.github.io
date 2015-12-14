(function () {
	var Road = Farmer.Road = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			x: 0,
			y: 0,
			tileWidth: 1,
			tileHeight: 1,
			costToPlace: 20,
			id: "road"
		}, _options);
		Farmer.Game.buildings.road.push (this);
	};

	Road.prototype = new Farmer.Building ({});
	Road.prototype.constructor = Road;

	Road.prototype.place = function () {

	};

	Road.prototype.ghostMode = function (bool) {
		var self = this;

		self.options.ghostMode = bool;
	};

	Road.prototype.render = function (ctx, cam, z) {
		var self = this,
			options = self.options,
			x = options.x,
			y = options.y,
			camera = cam || Farmer.vars.camera,
			zoom = z || Farmer.vars.zoom;

		// ctx.fillStyle = 'black';

		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileWidth, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileHeight);

		var tileSize = Farmer.vars.tileSize;
		var key = Farmer.vars.sprites.road.img;
		var img = Farmer.vars.imageObjs [key];
		var sx = Farmer.vars.sprites.road.x * tileSize;
		var sy = Farmer.vars.sprites.road.y * tileSize;
		
		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom);

		ctx.drawImage (img, sx, sy, tileSize, tileSize, 
						x * Farmer.vars.tileSize * zoom - camera.x,
						y * Farmer.vars.tileSize * zoom - camera.y, 
						Farmer.vars.tileSize * zoom, 
						Farmer.vars.tileSize * zoom);
	};
}) ();