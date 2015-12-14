(function () {
	var City = Farmer.City = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			x: 0,
			y: 0,
			tileWidth: 9,
			tileHeight: 9,
			population: 0,
			name: Farmer.CityNames [Math.floor(Math.random () * Farmer.CityNames.length)],
			entryRoads: [],
			id: 'city',
			cityType: 'city' + (Math.floor(Math.random () * 3) + 1)
		}, _options);
	};

	City.prototype = new Farmer.Building ({});
	City.prototype.constructor = City;

	City.prototype.render = function (ctx, cam, z) {
		var self = this,
			options = self.options,
			x = options.x,
			y = options.y,
			camera = cam || Farmer.vars.camera,
			zoom = z || Farmer.vars.zoom;;

		// ctx.fillStyle = 'blue';

		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x , 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileWidth, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileHeight);
		var type = options.cityType;
		var tileSize = Farmer.vars.tileSize;
		var key = Farmer.vars.sprites [type].img;
		var img = Farmer.vars.imageObjs [key];
		// var sx = Farmer.vars.sprites [type].x * tileSize;
		// var sy = Farmer.vars.sprites [type].y * tileSize;
		
		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom);

		ctx.drawImage (img,
						x * Farmer.vars.tileSize * zoom - camera.x,
						y * Farmer.vars.tileSize * zoom - camera.y, 
						Farmer.vars.tileSize * zoom * options.tileWidth, 
						Farmer.vars.tileSize * zoom * options.tileHeight);
	};

	City.prototype.getTitle = function () {
		return this.options.name;
	};

	City.prototype.getInfo = function () {
		var self = this,
			options = self.options;

		return [
			{
				title: 'Population',
				type: 'keyvalue',
				value: options.population
			}
		]
	}

	City.prototype.getActions = function () {
		var self = this,
			options = self.options;

		return [
			{
				title: 'Change Name',
				action: function () {

				}
			}
		];
	};

	City.prototype.unload = function (inv) {
		var self = this;
			options = self.options;

		// Farmer.Game.money += inv * Farmer.vars.price.grain;
		Farmer.Finance.income ({
			amt: inv * Farmer.vars.price.grain,
			type: 'sale',
			title: 'Sale items at ' + options.name,
			date: Farmer.Game.date
		});
		return inv;
	};
}) ();