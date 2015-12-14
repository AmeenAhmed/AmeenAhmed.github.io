(function () {
	var Village = Farmer.Village = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			x: 0,
			y: 0,
			tileWidth: 6,
			tileHeight: 6,
			population: 0
		}, _options);
	};

	Village.prototype = new Farmer.Building ({});
	Village.prototype.constructor = Village;

	Village.prototype.render = function (ctx) {
		var self = this,
			options = self.options,
			x = options.x,
			y = options.y;

		ctx.fillStyle = 'red';

		ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
						y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
						Farmer.vars.tileSize * Farmer.vars.zoom * options.tileWidth, 
						Farmer.vars.tileSize * Farmer.vars.zoom * options.tileHeight);
	};
}) ();