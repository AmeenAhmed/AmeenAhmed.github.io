(function () {
	var Tile = Farmer.Tile = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			x: 0,
			y: 0,
			type: 'grass',
			contains: null
		}, _options);
	};

	Tile.prototype.render = function (ctx, cam, z) {
		var self = this,
			options = self.options,
			type = options.type,
			x = options.x,
			y = options.y,
			camera = cam || Farmer.vars.camera,
			zoom = z || Farmer.vars.zoom;;

		if (type === 'land') {
			ctx.fillStyle = 'saddlebrown';

		} else if (type === 'fertile') {
			ctx.fillStyle = 'seagreen';
		} else if (type === 'grazing') {
			ctx.fillStyle = 'darkseagreen';
		}
		var tileSize = Farmer.vars.tileSize;
		var key = Farmer.vars.sprites [type].img;
		var img = Farmer.vars.imageObjs [key];
		var sx = Farmer.vars.sprites [type].x * tileSize;
		var sy = Farmer.vars.sprites [type].y * tileSize;
		
		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom);

		ctx.drawImage (img, sx, sy, tileSize, tileSize, 
						(x * Farmer.vars.tileSize * zoom - camera.x) - 1,
						(y * Farmer.vars.tileSize * zoom - camera.y) - 1, 
						(Farmer.vars.tileSize * zoom) + 1, 
						(Farmer.vars.tileSize * zoom) + 1);

		if (options.contains !== null) {
			options.contains.render (ctx, cam, z);
		}
	};

	Tile.prototype.setOption = function (key, value) {
		var self = this;

		self.options [key] = value;
	}

	Tile.prototype.getType = function () {
		return this.options.type;
	}
})();