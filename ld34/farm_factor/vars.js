(function () {
	Farmer.vars = {
		settings: {
			music: true,
			sounds: true
		},
		zoom: 1,
		tileSize: 32,
		camera: {
			x: 0,
			y: 0
		},
		costs: {
			workers: 50,
			caravan: 100,
			farm: 100,
			trade_depot: 200
		},
		wages: {
			workers: 0.5,
			caravan: 1
		},
		price: {
			grain: 10
		},
		sprites: {
			land: {
				img: 'terrain',
				x: 2,
				y: 5
			},
			grazing: {
				img: 'terrain',
				x: 14,
				y: 11
			},
			fertile: {
				img: 'terrain',
				x: 7,
				y: 11
			},
			road: {
				img: 'terrain',
				x: 3,
				y: 0
			},
			city1: {
				img: 'city1'
			},
			city2: {
				img: 'city2'
			},
			city3: {
				img: 'city3'
			},
			farm0: {
				img: 'farm0'
			},
			farm1: {
				img: 'farm1'
			},
			farm2: {
				img: 'farm2'
			},
			farm3: {
				img: 'farm3'
			},
			farm4: {
				img: 'farm4'
			},
			farm5: {
				img: 'farm5'
			},
			depot: {
				img: 'depot'
			},
			horse_left: {
				img: 'left'
			},
			horse_right: {
				img: 'right'
			},
			horse_forward: {
				img: 'forward'
			},
			horse_backward: {
				img: 'backward'
			}
		},
		images: {
			terrain: 'terrain.png',
			city1: 'city1.png', 
			city2: 'city2.png',
			city3: 'city3.png',
			farm0: 'farm0.png',
			farm1: 'farm1.png',
			farm2: 'farm2.png',
			farm3: 'farm3.png',
			farm4: 'farm4.png',
			farm5: 'farm5.png',
			depot: 'depot.png',
			left: 'left.png',
			right: 'right.png',
			forward: 'forward.png',
			backward: 'backward.png'
		},
		imageObjs: {

		}
	};

}) ();