(function () {
	var Caravan = Farmer.Caravan = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			idle: true,
			x: 0,
			y: 0,
			tileX: 0,
			tileY: 0,
			inventory: 0,
			maxInventorySpace: 30,
			ordersList: [],
			currentOrderIdx: 0,
			go: false,
			moving: false,
			loading: false,
			unloading: false,
			path: [],
			garrisonedIn: null,
			tileWidth: 2,
			tileHeight: 2,
			status: 'garrsioned',
			facing: 'forward',
			spriteIdx: 0,
			name: Farmer.Names.firstnames[Math.floor (Math.random () * Farmer.Names.firstnames.length)] + ' ' +
					Farmer.Names.lastnames[Math.floor (Math.random () * Farmer.Names.lastnames.length)]
		}, _options);

		Farmer.Game.people.caravan.push (self);

		Farmer.Timer.subscribeRepeat (function () {
			options.spriteIdx ++;
			if (options.spriteIdx === 3) {
				options.spriteIdx = 0;
			}
		}, 250);

		Farmer.Timer.subscribeTick (function () {
			if (options.go) {
				if (options.nextTask) {
					if (options.nextTask.building.options.x === options.tileX &&
						options.nextTask.building.options.y === options.tileY) {
						if (options.moving) {
							options.status = options.nextTask.action + 'ing';
							if (options.nextTask.action === 'load') {
								options.loading = true;	
								options.unloading = false;
							} else if (options.nextTask.action === 'unload') {
								options.loading = false;
								options.unloading = true;
							}
							
							options.moving = false;
							options.garrisonedIn = options.nextTask.building;
						} else {
							if (options.unloading) {
								// TODO Unload goods here
								console.log ('unloading');
								// After unload
								options.currentOrderIdx ++;
								// If list is exhausted go to 1st task
								if (options.currentOrderIdx === options.ordersList.length) {
									options.currentOrderIdx = 0;
								}
								options.inventory -= options.nextTask.building.unload (options.inventory);
								options.nextTask = null;
							} else if (options.loading) {
								// TODO Load goods here
								console.log ('loading');
								options.inventory += options.nextTask.building.load (options.maxInventorySpace);

								options.currentOrderIdx ++;
								// If list is exhausted go to 1st task
								if (options.currentOrderIdx === options.ordersList.length) {
									options.currentOrderIdx = 0;
								}
								options.nextTask = null;
							}
						}
							
					} else {
						if (!options.moving && options.garrisonedIn) {
							console.log ('Moving to next place now');
							// try to move in that direction
							options.moving = true;
							// Get a path to the object
							options.path = Farmer.Game.map.getPath ({
								x: options.garrisonedIn.options.x,
								y: options.garrisonedIn.options.y
							}, {
								x: options.nextTask.building.options.x,
								y: options.nextTask.building.options.y
							});
							if (options.path.length) {
								// console.log ('Path -> ', options.path);
								options.tileX = options.path[0].y;
								options.tileY = options.path[0].x;
								options.x = options.tileX * Farmer.vars.tileSize;
								options.y = options.tileY * Farmer.vars.tileSize;
								// debugger
								options.garrisonedIn = null;
								options.path = options.path.slice (1);
								//debugger
							} else {
								options.currentOrderIdx ++;
								// If list is exhausted go to 1st task
								if (options.currentOrderIdx === options.ordersList.length) {
									options.currentOrderIdx = 0;
								}
								options.moving = false;
								options.nextTask = null;
							}
								
						}
						if (options.moving) {
							options.status = 'moving';
							if (options.x === options.path [0].y * Farmer.vars.tileSize && 
								options.y === options.path [0].x * Farmer.vars.tileSize) {
								options.tileX = options.path[0].y;
								options.tileY = options.path[0].x;
								// options.x = options.tileX * Farmer.vars.tileSize;
								// options.y = options.tileY * Farmer.vars.tileSize;
								options.path = options.path.slice (1);
								// if (options.path.length === 0) {
								// 	// Start next task
								// 	options.moving = false;
								// }
							}
							if (options.path.length) {
								var xDiff = options.path [0].y - options.tileX;
								var yDiff = options.path [0].x - options.tileY;

								options.x += xDiff * 4;
								options.y += yDiff * 4;

								if (yDiff < 0) {
									options.facing = 'forward';
								} else if (yDiff > 0) {
									options.facing = 'backward';
								} else if (xDiff < 0) {
									options.facing = 'left';
								} else if (xDiff > 0) {
									options.facing = 'right';
								}
							}
								

								// console.log (options.x, options.y, xDiff, yDiff);
							// }
						}
					}
				} else {
					options.nextTask = options.ordersList [options.currentOrderIdx];
					console.log ('Next Task : ' + options.ordersList [options.currentOrderIdx].title);
				}
			}
		});
	};

	Caravan.prototype.getOrdersList = function () {
		var self = this,
			options = self.options;

		return options.ordersList;
	};

	Caravan.prototype.getActions = function () {
		var self = this,
			options = self.options;

		return [
			{
				title: 'Go',
				action: function () {
					options.go = true;
				}
			},
			{
				title: 'Stop',
				action: function () {
					debugger
				}
			},
			{
				title: 'Go to Depot',
				action: function () {
					debugger
				}
			}
		];
	};

	Caravan.prototype.getOrders = function () {
		var self = this,
			options = self.options,
			orders = [],
			cities = Farmer.Game.cities,
			farms = Farmer.Game.buildings.farm;
		for (var i=0; i<cities.length; i++) {
			orders.push ({
				title: 'Unload at ' + cities[i].options.name,
				action: 'unload',
				building: cities [i]
			});
		}

		for (var i=0; i<farms.length; i++) {
			orders.push ({
				title: 'Load at ' + farms[i].options.name,
				action: 'load',
				building: farms [i]
			});
		}
		return orders;
	}

	Caravan.prototype.openInfo = function () {
		var self = this;
		var options = self.options;

		new Farmer.OrdersView ({
			title: options.name,
			ordersList: self.getOrdersList (),
			actions: self.getActions (),
			obj: self,
			orders: self.getOrders ()
		});
	};

	Caravan.prototype.render = function (ctx, cam, z) {
		var self = this;
		var options = self.options,
			x = options.x,
			y = options.y,
			camera = cam || Farmer.vars.camera,
			zoom = z || Farmer.vars.zoom;

		// ctx.fillStyle = 'magenta';
		// // console.log ();
		// ctx.fillRect (x * Farmer.vars.zoom - Farmer.vars.camera.x , 
		// 				y * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileWidth, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileHeight);
		var type = 'horse_' + options.facing;
		var tileSize = 64;
		var key = Farmer.vars.sprites [type].img;
		var img = Farmer.vars.imageObjs [key];
		var sx = 0;
		var sy = options.spriteIdx * tileSize;

		console.log ();
		
		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom);

		ctx.drawImage (img, sx, sy, tileSize, tileSize, 
						x * zoom - camera.x - 16, 
						y * zoom - camera.y - 16, 
						Farmer.vars.tileSize * zoom * options.tileWidth,
						Farmer.vars.tileSize * zoom * options.tileHeight);

	};
}) ();