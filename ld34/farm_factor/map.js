(function () {
	var Map = Farmer.Map = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			width: 100,
			height: 100,
			map: [],
			cities: [],
			graphArray: [],
			graph: null,
			paths: [],
			roadMarker: [],
			pointerPos: {x:0, y:0},
			pointerMode: 'pointer',
			pointerObject: null
		}, _options);

		for (var i=0; i<options.width; i++) {
			options.map [i] = [];
			options.graphArray [i] = [];
			for (var j=0; j<options.height; j++) {
				options.map [i][j] = null;
				options.graphArray [i][j] = 1;
			}			
		}
	};

	Map.prototype.generate = function () {
		var self = this,
			options = self.options,
			map = options.map;

		var n1 = Math.random ();
		var n2 = Math.random ();
		var n3 = Math.random ();
		

		for (var i=0; i<options.width; i++) {
			for (var j=0; j<options.height; j++) {
				noise.seed (n1);
				var fertility = noise.simplex2 (i / 40, j / 40) * 20 - 10;
				noise.seed (n2);
				fertility += noise.simplex2 (i / 20, j / 20) * 20;
				noise.seed (n3);
				fertility += noise.simplex2 (i / 10, j / 10) * 20;				

				if (fertility < 0) {
					map [i][j] = new Farmer.Tile ({
						x: j,
						y: i,
						type: 'land'
					});
				} else if (fertility > 10) {
					map [i][j] = new Farmer.Tile ({
						x: j,
						y: i,
						type: 'fertile'
					});
				} else if (fertility >= 0) {
					map [i][j] = new Farmer.Tile ({
						x: j,
						y: i,
						type: 'grazing'
					});
				}
			}			
		}
		// var villageList = [];
		// var numVillages = options.numVillages;
		// do {
		// 	var x = Math.floor (Math.random () * options.width);
		// 	var y = Math.floor (Math.random () * options.height);

		// 	if (villageList.indexOf (x + ',' + y) === -1 && x < options.width - 6 && y < options.width - 6) {
		// 		var village = new Farmer.Village ({
		// 			x: x,
		// 			y: y,
		// 			population: Math.random () * 100
		// 		});

		// 		options.villages.push (village);
		// 		for (var i=0; i<6; i++) {
		// 			for (var j=0; j<6; j++) {
		// 				options.map [y + i][x + j].setOption ('contains', village);
		// 			}
		// 		}
				
		// 		villageList.push (x + ',' + y);
		// 		numVillages --;
		// 	}
		// } while (numVillages > 0);

		var cityList = [];
		var cityCoordList = [];
		var numCities = options.numCities;
		var q = 0;
		do {
			var x = Math.floor (Math.random () * options.width / 2);
			var y = Math.floor (Math.random () * options.height / 2);		
			
			if (q === 1) {
				x += options.width / 2;	
			} else if (q === 2) {
				y += options.width / 2;
			} else if (q === 3) {
				x += options.width / 2;	
				y += options.width / 2;
			}
			

			if (cityList.indexOf (x + ',' + y) === -1 && x < options.width - 9 && y < options.width - 9) {
				var city = new Farmer.City ({
					x: x,
					y: y,
					population: Math.floor (Math.random () * 1000)
				});

				options.cities.push (city);

				for (var i=0; i<9; i++) {
					for (var j=0; j<9; j++) {
						options.map [y + i][x + j].setOption ('contains', city);
					}
				}
				

				
				cityList.push (x + ',' + y);
				cityCoordList.push ({x: x, y: y});
				numCities --;
				q++;
			}
		} while (numCities > 0);
		Farmer.Game.cities = options.cities;
		options.graph = new Graph (options.graphArray, {diagonal: true});
		for (var i=0; i<options.numCities; i++) {
			for (var j=i+1; j<options.numCities; j++) {
				var city1 = options.cities [i];
				var city2 = options.cities [j];

				var start = options.graph.grid [city1.options.y][city1.options.x];
				var end = options.graph.grid [city2.options.y][city2.options.x];
				options.paths.push (astar.search (options.graph, start, end));
			}			
		}

		for (var i=0; i<options.paths.length; i++) {
			for (var j=0; j<options.paths[i].length; j++) {
				var node = options.paths[i][j];
				if (!options.map [node.x][node.y].options.contains) {
					options.map [node.x][node.y].setOption ('contains', new Farmer.Road ({
						x: node.y,
						y: node.x
					}));	
				}
			}
		}

		self._refreshCityConnections ();
		
	}

	Map.prototype._refreshCityConnections = function () {
		var self = this,
			options = self.options;
		for (var i=0; i<options.numCities; i++) {
			var city = options.cities [i];
			// city.options.entryRoads = [];
			// var bx = city.options.x - 1
			// 	by = city.options.y - 1,
			// 	ex = city.options.x + city.options.tileWidth,
			// 	ey = city.options.y + city.options.tileHeight;

			// for (var j=bx; j<bx+9; j++) {
			// 	if (options.map [by][j].options.contains && 
			// 			options.map [by][j].options.contains.options.id === 'road') {
			// 		city.options.entryRoads.push (options.map [by][j].options.contains);
			// 	}
			// 	if (options.map [ey][j].options.contains && 
			// 			options.map [ey][j].options.contains.options.id === 'road') {
			// 		city.options.entryRoads.push (options.map [ey][j].options.contains);
			// 	}
			// }
			// for (var j=by; j<by+9; j++) {
			// 	if (options.map [j][bx].options.contains && 
			// 			options.map [j][bx].options.contains.options.id === 'road') {
			// 		city.options.entryRoads.push (options.map [j][bx].options.contains);
			// 	}
			// 	if (options.map [j][ex].options.contains && 
			// 			options.map [j][ex].options.contains.options.id === 'road') {
			// 		city.options.entryRoads.push (options.map [j][ex].options.contains);
			// 	}
			// }
			self._refreshBuildingConnection (city);
			self.generateWalkPathGraph ();
		}
	};

	Map.prototype._refreshAllConnections = function () {
		var self = this,
			buildings = Farmer.Game.buildings;

		self._refreshCityConnections ();
		for (var key in buildings) {
			if (buildings.hasOwnProperty (key) && key !== 'road') {
				for (var i=0; i<buildings [key].length; i++) {
					self._refreshBuildingConnection (buildings [key][i]);
				}
			}
		}
		self.generateWalkPathGraph ();
	};

	Map.prototype._refreshBuildingConnection = function (building) {
		var self = this,
			options = self.options;
		building.options.entryRoads = [];
		var bx = building.options.x - 1
			by = building.options.y - 1,
			ex = building.options.x + building.options.tileWidth,
			ey = building.options.y + building.options.tileHeight;

		for (var j=bx; j<ex; j++) {
			if (options.map [by][j].options.contains && 
					options.map [by][j].options.contains.options.id === 'road') {
				building.options.entryRoads.push (options.map [by][j].options.contains);
			}
			if (options.map [ey][j].options.contains && 
					options.map [ey][j].options.contains.options.id === 'road') {
				building.options.entryRoads.push (options.map [ey][j].options.contains);
			}
		}
		for (var j=by; j<ey; j++) {
			if (options.map [j][bx].options.contains && 
					options.map [j][bx].options.contains.options.id === 'road') {
				building.options.entryRoads.push (options.map [j][bx].options.contains);
			}
			if (options.map [j][ex].options.contains && 
					options.map [j][ex].options.contains.options.id === 'road') {
				building.options.entryRoads.push (options.map [j][ex].options.contains);
			}
		}
	}

	Map.prototype.render = function (ctx, cam, z) {
		var self = this,
			options = self.options,
			map = options.map,
			camera = cam || Farmer.vars.camera,
			zoom = z || Farmer.vars.zoom;

		for (var i=0; i<options.width; i++) {
			for (var j=0; j<options.height; j++) {
				if (i !== options.pointerPos.tileY || j !== options.pointerPos.tileX) {
					map [i][j].render (ctx, cam, z);	
				}
			}			
		}
		// for (var i=0; i<options.width; i++) {
		// 	for (var j=0; j<options.height; j++) {
		// 		var x = map [i][j].options.x,
		// 			y = map [i][j].options.y;

		// 		if (options.walkPathGraph [i][j] === 0) {
		// 			ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
		// 		} else {
		// 			ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
		// 		}
		// 		ctx.fillRect (x * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.x, 
		// 			y * Farmer.vars.tileSize * Farmer.vars.zoom - Farmer.vars.camera.y, 
		// 			Farmer.vars.tileSize * Farmer.vars.zoom, 
		// 			Farmer.vars.tileSize * Farmer.vars.zoom);			
		// 	}			
		// }
		// console.log (options.pointerObject);
		if (options.pointerMode === 'build' && options.pointerObject) {
			options.pointerObject.render (ctx);
		}

		for (var i=0; i<options.roadMarker.length; i++) {
			var x = options.roadMarker [i].x,
				y = options.roadMarker [i].y;
			ctx.fillStyle = '#000';
			ctx.fillRect (x * Farmer.vars.tileSize * zoom - camera.x, 
						y * Farmer.vars.tileSize * zoom - camera.y, 
						Farmer.vars.tileSize * zoom, 
						Farmer.vars.tileSize * zoom);			
		}
		// ctx.fillStyle = '#0f0';
		// ctx.fillText (options.pointerPos.tileX + ',' + options.pointerPos.tileY, 20, 20);
	};

	Map.prototype.initEvents = function () {
		var self = this,
			options = self.options;

		$('#can').on ('mousewheel', function (ev) {
			// console.log ();
			Farmer.vars.zoom += ev.originalEvent.deltaY / 10000;
			ev.preventDefault ();
			ev.stopPropagation ();
		});
		var mousedown = false, sx, sy, startBuild = false, sTileX, sTileY;
		$('#can').on ('mousedown', function (ev) {
			sx = ev.offsetX;
			sy = ev.offsetY;
			sTileX =  Math.floor((ev.offsetX + Farmer.vars.camera.x) / (Farmer.vars.tileSize * Farmer.vars.zoom));
			sTileY = Math.floor((ev.offsetY + Farmer.vars.camera.y) / (Farmer.vars.tileSize * Farmer.vars.zoom));
			mousedown = true;
			if (options.pointerMode === 'build' && options.pointerObject 
					&& Farmer.Game.money >= options.pointerObject.options.costToPlace && options.buildStyle === 'line') {
				startBuild = true;
			}

			
		});
		function line(x0, y0, x1, y1){
		   var dx = Math.abs(x1-x0);
		   var dy = Math.abs(y1-y0);
		   var sx = (x0 < x1) ? 1 : -1;
		   var sy = (y0 < y1) ? 1 : -1;
		   var err = dx-dy;
		   var line = [];

		   while(true){
		     // setPixel(x0,y0);  // Do what you need to for this
		     line.push ({x: x0, y: y0});
		     if ((x0==x1) && (y0==y1)) break;
		     var e2 = 2*err;
		     if (e2 >-dy){ err -= dy; x0  += sx; }
		     if (e2 < dx){ err += dx; y0  += sy; }
		   }
		   return line;
		}
		$('#can').on ('mouseup', function () {
			mousedown = false;
			if (options.pointerMode === 'build' && options.pointerObject 
					&& Farmer.Game.money >= Farmer.vars.costs [options.pointerObject.options.id] && options.buildStyle === 'place') {
				// Farmer.Game.money -= options.pointerObject.options.costToPlace;
				Farmer.Finance.expense ({
					amt: Farmer.vars.costs [options.pointerObject.options.id],
					type: 'construction',
					title: 'Building ' + options.pointerObject.options.name,
					date: Farmer.Game.date
				});
				Farmer.Game.sounds.interface6.play ();
				options.pointerObject.ghostMode (false);
				options.pointerObject.place ();
				self._refreshBuildingConnection (options.pointerObject);
				options.map [options.pointerObject.options.y][options.pointerObject.options.x]
								.setOption ('contains', options.pointerObject);
				for(var i=0; i<options.pointerObject.options.tileWidth; i++) {
					for(var j=0; j<options.pointerObject.options.tileHeight; j++) {
						options.map [options.pointerObject.options.y + i][options.pointerObject.options.x + j]
								.setOption ('contains', options.pointerObject);
					}	
				}
				self.generateWalkPathGraph ();
				options.pointerObject = null;
				self.setBuildMode (options.pointerObjectId);
			} else if (options.pointerMode === 'pointer') {
				var tile = options.map [options.pointerPos.tileY][options.pointerPos.tileX];
				// console.log (tile.options);
				if (tile.options.contains && tile.options.contains.getInfo) {
					new Farmer.InfoView ({
						title: tile.options.contains.getTitle (),
						infoList: tile.options.contains.getInfo (),
						actions: tile.options.contains.getActions (),
						obj: tile.options.contains
					});
				}
			}
			if (startBuild) {
				var path = line (sTileX, sTileY, options.pointerPos.tileX, options.pointerPos.tileY);
				options.roadMarker = [];
				for(var i=0; i<path.length; i++) {
					var r = new Farmer.Road ({
						x: path [i].x,
						y: path [i].y
					});
					Farmer.Game.buildings.road.push (r);

					options.map [path [i].y][path [i].x]
						.setOption ('contains', r);
					startBuild = false;
				}
				self._refreshAllConnections ();
			}
		});
		$('#can').on ('mousemove', function (ev) {
			if (mousedown && !startBuild) {
				var dx = sx - ev.offsetX;
				var dy = sy - ev.offsetY;

				Farmer.vars.camera.x += dx;
				Farmer.vars.camera.y += dy;

				sx = ev.offsetX;
				sy = ev.offsetY;
				ev.preventDefault ();
				ev.stopPropagation ();
			}
			options.pointerPos = {
				x: ev.offsetX,
				y: ev.offsetY,
				tileX: Math.floor((ev.offsetX + Farmer.vars.camera.x) / (Farmer.vars.tileSize * Farmer.vars.zoom)),
				tileY: Math.floor((ev.offsetY + Farmer.vars.camera.y) / (Farmer.vars.tileSize * Farmer.vars.zoom))
			};

			if (options.pointerMode === 'build') {
				if (options.pointerObject) {
					options.pointerObject.setOption ('x', options.pointerPos.tileX);	
					options.pointerObject.setOption ('y', options.pointerPos.tileY);	
				}
			}
			if (startBuild) {
				var path = line (sTileX, sTileY, options.pointerPos.tileX, options.pointerPos.tileY);
				options.roadMarker = path;
			}
			// console.log (options.pointerPos.tileX, options.pointerPos.tileY);
		});
	};

	Map.prototype.setBuildMode = function (id) {
		var self = this,
			options = self.options;
		options.pointerMode = 'build';
		if (options.pointerObject && options.pointerObject.options.id !== 'road') {
			Farmer.Game.buildings [options.pointerObject.options.id] = 
				_.without (Farmer.Game.buildings [options.pointerObject.options.id], options.pointerObject);
		}
		options.pointerObject = null;
		options.pointerObjectId = id;

		if (id === 'wheat_farm') {
			options.buildStyle = 'place';
			options.pointerObject = new Farmer.Farm ({
				x: 0,
				y: 0
			});
		} else if (id === 'trade_depot') {
			options.buildStyle = 'place';
			options.pointerObject = new Farmer.TradeDepot ({
				x: 0,
				y: 0
			});
		} else if (id === 'road') {
			options.buildStyle = 'line';
			options.pointerObject = new Farmer.Road ({
				x: 0,
				y: 0
			});
		}
	};

	Map.prototype.setPointerMode = function () {
		var self = this,
			options = self.options;
		if (options.pointerObject && options.pointerObject.options.id !== 'road') {
			Farmer.Game.buildings [options.pointerObject.options.id] = 
				_.without (Farmer.Game.buildings [options.pointerObject.options.id], options.pointerObject);
		}
		options.pointerMode = 'pointer';
		options.pointerObject = null;
		options.pointerObjectId = null;
	};

	Map.prototype.generateWalkPathGraph = function () {
		var self = this,
			options = self.options,
			walkPathGraph = [];

		for (var i=0; i<options.width; i++) {
			walkPathGraph [i] = [];
			for (var j=0; j<options.height; j++) {
				// if (options.map [i][j].options.contains) debugger;
				if (options.map [i][j].options.contains) { //&& 
					// (options.map [i][j].options.contains.options.id === 'city' || 
					// 	options.map [i][j].options.contains.options.id === 'road')) {
					walkPathGraph [i][j] = 1;

				} else {
					walkPathGraph [i][j] = 0;
				}
			}			
		}
		options.walkPathGraph = walkPathGraph;
	};

	Map.prototype.checkConnectionToAnyCity = function (building) {
		var self = this,
			options = self.options,
			graph = new Graph (options.walkPathGraph, {diagonal: true});

		for (var i=0; i<options.numCities; i++) {
			var city = options.cities [i];

			var start = graph.grid [city.options.y][city.options.x];
			for (var j=0; j<building.options.entryRoads.length; j++) {
				var road = building.options.entryRoads [j];
				var end = graph.grid [road.options.y][road.options.x];
				var path = astar.search (graph, start, end, { heuristic: astar.heuristics.diagonal });
				// console.log (path);
				if (path.length > 0) {
					return true;
				}
			}
		}
	}

	Map.prototype.getPath = function (from, to) {
		var self = this,
			options = self.options,
			graph = new Graph (options.walkPathGraph, {diagonal: true});

		var start = graph.grid [from.y][from.x];
		var end = graph.grid [to.y][to.x];
		var path = astar.search (graph, start, end, { heuristic: astar.heuristics.diagonal });
		console.log (path, from, to);
		return path;
	}

	Map.prototype.getPathBetweenBuilings = function (from, to) {
		var self = this,
			options = self.options,
			graph = new Graph (options.walkPathGraph, {diagonal: true});

		var start = graph.grid [from.options.y][from.options.x];
		var end = graph.grid [to.options.y][to.options.x];
		var path = astar.search (graph, start, end, { heuristic: astar.heuristics.diagonal });
		console.log (path, from, to);
		return path;
	}
})();