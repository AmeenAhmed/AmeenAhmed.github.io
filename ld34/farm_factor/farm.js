(function () {
	var Farm = Farmer.Farm = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			x: 0,
			y: 0,
			tileWidth: 4,
			tileHeight: 4,
			maxWorkers: 5,
			maxStockpile: 50,
			stockPile: 0,
			workers: 0,
			fertility: 0,
			maxProduction: 10,
			working: false,
			costToPlace: 200,
			id: 'farm',
			entryRoads: [],
			name: 'Farm ' + (Farmer.Game.buildings.farm.length + 1),
			workerActors: [],
			currentFrame: 0
		}, _options);
		Farmer.Game.buildings.farm.push (this);
	};

	Farm.prototype = new Farmer.Building ({});
	Farm.prototype.constructor = Farm;

	Farm.prototype.place = function () {
		var self = this,
			options = self.options;

		for (var i=options.y; i<options.y + options.tileWidth; i++) {
			for (var j=options.x; j<options.x + options.tileHeight; j++) {
				var tile = map.options.map [i][j];
				if (tile.getType () === 'fertile') {
					options.fertility += 1;
				} else if (tile.getType () === 'grazing') {
					options.fertility += 0.5;
				} else {
					options.fertility += 0.25;
				}
			}			
		}

		Farmer.Game.subscribeForDay (function () {
			if (options.workers < 1) {
				options.working = false;
			} else {
				options.working = true;
			}
			// console.log (options.workers, options.working);
			if (options.working) {
				options.stockPile += 2 * (options.fertility / 16) * (options.workers / options.maxWorkers);	
			}

			if(options.stockPile > options.maxStockpile) {
				options.stockPile = options.maxStockpile;
				options.working = false;
			}
			options.productionPerDay = 2 * (options.fertility / 16) * (options.workers / options.maxWorkers);	
		});

		Farmer.Timer.subscribeRepeat (function () {
			if (options.working) {
				options.currentFrame ++;
				if (options.currentFrame > 5) {
					options.currentFrame = 0;
				}
			}
		}, 500);

	};

	Farm.prototype.ghostMode = function (bool) {
		var self = this;

		self.options.ghostMode = bool;
	};

	Farm.prototype.render = function (ctx, cam, z) {
		var self = this,
			options = self.options,
			x = options.x,
			y = options.y,
			camera = cam || Farmer.vars.camera,
			zoom = z || Farmer.vars.zoom;

		// ctx.fillStyle = 'khaki';

		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileWidth, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileHeight);

		var type = 'farm' + options.currentFrame;
		var tileSize = Farmer.vars.tileSize;
		var key = Farmer.vars.sprites [type].img;
		var img = Farmer.vars.imageObjs [key];

		ctx.drawImage (img,
						x * Farmer.vars.tileSize * zoom - camera.x,
						y * Farmer.vars.tileSize * zoom - camera.y, 
						Farmer.vars.tileSize * zoom * options.tileWidth, 
						Farmer.vars.tileSize * zoom * options.tileHeight);
	};

	Farm.prototype.getTitle = function () {
		var self = this;
		return self.options.name;
	};

	Farm.prototype.getInfo = function () {
		var self = this,
			options = self.options;

		return [
			{
				title: 'Workers',
				type: 'keyvalue',
				value: options.workers + '/' + options.maxWorkers
			},
			{
				title: 'StockPile',
				type: 'keyvalue',
				value: options.stockPile.toPrecision (2) + '/' + options.maxStockpile
			},
			{
				title: 'Production Per Day',
				type: 'keyvalue',
				value: options.productionPerDay.toPrecision (2) + ' Bags'
			}
		];
	};

	Farm.prototype.getActions = function () {
		var self = this,
			options = self.options;

		return [
			{
				title: 'Hire Worker',
				action: function () {
					var b = map.checkConnectionToAnyCity (self);
					if (b) {
						if (Farmer.Finance.balance >= Farmer.vars.costs.workers && options.workers < options.maxWorkers) {
							// Farmer.Game.money -= Farmer.vars.costs.workers;
							options.workerActors = new Farmer.Worker ({
								workingAt: self
							});
							Farmer.Finance.expense ({
								amt: Farmer.vars.costs.workers,
								type: 'hire',
								title: 'Hiring ' + options.workerActors.options.name,
								date: Farmer.Game.date
							});
							options.workers ++;
						} else {
							if (Farmer.Finance.balance < Farmer.vars.costs.workers) {
								alert ('No money to hire a worker!');
							}

							if (options.workers === options.maxWorkers) {
								alert ('Reached Maximum capacity!');
							}
							
						}
					} else {
						alert ('No city connection! please build a road to connect to any city');
					}
				}
			}
		];
	};

	Farm.prototype.load = function (maxIn) {
		var self = this,
			options = self.options;
		if (options.stockPile > maxIn) {
			options.stockPile -= maxIn;
			return maxIn;
		} else {
			var t = options.stockPile;
			options.stockPile = 0;
			return t;
		}
	};
}) ();