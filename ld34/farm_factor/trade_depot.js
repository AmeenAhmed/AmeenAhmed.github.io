(function () {
	var TradeDepot = Farmer.TradeDepot = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			x: 0,
			y: 0,
			tileWidth: 4,
			tileHeight: 4,
			costToPlace: 200,
			id: "trade_depot",
			entryRoads: [],
			name: 'Trade Depot ' + (Farmer.Game.buildings.trade_depot.length + 1),
			garrison: []
		}, _options);
		Farmer.Game.buildings.trade_depot.push (this);
	};

	TradeDepot.prototype = new Farmer.Building ({});
	TradeDepot.prototype.constructor = TradeDepot;

	TradeDepot.prototype.place = function () {

	};

	TradeDepot.prototype.ghostMode = function (bool) {
		var self = this;

		self.options.ghostMode = bool;
	};

	TradeDepot.prototype.render = function (ctx, cam, z) {
		var self = this,
			options = self.options,
			x = options.x,
			y = options.y,
			camera = cam || Farmer.vars.camera,
			zoom = z || Farmer.vars.zoom;

		// ctx.fillStyle = 'Coral';

		// ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 				y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileWidth, 
		// 				Farmer.vars.tileSize * Farmer.vars.zoom * options.tileHeight);

		var type = 'depot';
		var tileSize = Farmer.vars.tileSize;
		var key = Farmer.vars.sprites [type].img;
		var img = Farmer.vars.imageObjs [key];

		ctx.drawImage (img,
						x * Farmer.vars.tileSize * zoom - camera.x,
						y * Farmer.vars.tileSize * zoom - camera.y, 
						Farmer.vars.tileSize * zoom * options.tileWidth, 
						Farmer.vars.tileSize * zoom * options.tileHeight);
	};

	TradeDepot.prototype.getTitle = function () {
		var self = this;
		return self.options.name;
	};

	TradeDepot.prototype.getInfo = function () {
		var self = this,
			options = self.options
			garrison = [];

		for(var i=0; i<options.garrison.length; i++) {
			garrison.push ({
				title: 'Caravan - ' + options.garrison [i].options.name,
				type: 'link',
				value: {
					obj: options.garrison [i],
					action: 'openInfo'
				}
			});
		}
		return garrison;
	};

	TradeDepot.prototype.getActions = function () {
		var self = this,
			options = self.options;

		return [
			{
				title: 'Hire Caravan',
				action: function () {

					var b = map.checkConnectionToAnyCity (self);
					if (b) {
						if (Farmer.Finance.balance > Farmer.vars.costs.caravan) {
							// Farmer.Game.money -= Farmer.vars.costs.caravan;
							var car = new Farmer.Caravan ({
								idle: true,
								tileX: self.options.x,
								tileY: self.options.y,
								x: self.options.x * Farmer.vars.tileSize, 
								y: self.options.y * Farmer.vars.tileSize, 
								depot: self,
								garrisonedIn: self
							});

							Farmer.Finance.expense ({
								amt: Farmer.vars.costs.caravan,
								type: 'hire',
								title: 'Hiring ' + car.options.name,
								date: Farmer.Game.date
							});
							self.options.garrison.push (car);
						}
					}
				}
			}
		];	
	}
}) ();