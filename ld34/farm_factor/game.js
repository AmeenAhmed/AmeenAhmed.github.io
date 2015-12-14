(function () {
	window.Farmer = {
	};

	var Game = window.Farmer.Game = {
		numWorkers: 0,
		workers: [],
		daySubscribers: {},
		money: 1000,
		map: null,
		buildings: {
			farm: [],
			trade_depot: [],
			road: []
		},
		people: {
			workers: [],
			caravan: []
		},
		sounds: {
			donkey: null,
			cow: null,
		},
		date: null,
		start: function (ctx) {
			Game.ctx = ctx;
			var startDate = new Date ('2 Nov 1268');
			var currDate = startDate;
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			$('.date').text (currDate.getDate () + ' ' + months[currDate.getMonth ()] + ' ' + currDate.getFullYear ());
			var map = Game.map = window.map = new Farmer.Map ({width: 128, height: 128, numCities: 4, numVillages: 12});
			map.generate ();
			map.initEvents ();
			var Finance = Farmer.Finance;

			Game.sounds.cow = document.getElementById ('cow');
			Game.sounds.donkey = document.getElementById ('donkey');
			Game.sounds.coins = document.getElementById ('coins');
			Game.sounds.door = document.getElementById ('door');
			Game.sounds.interface1 = document.getElementById ('interface1');
			Game.sounds.interface6 = document.getElementById ('interface6');

			Finance.loan = 1000;
			Finance.balance = 1000;

			var dayTimer = Game.dayTimer = Farmer.Timer.subscribeRepeat (function () {
				currDate = new Date (currDate.getTime () + 1000 * 60 * 60 * 24);
				$('.date').text (currDate.getDate () + ' ' + months[currDate.getMonth ()] + ' ' + currDate.getFullYear ());
				// console.log (_.keys (daySubscribers));
				for (var key in Game.daySubscribers) {
					if (Game.daySubscribers.hasOwnProperty (key)) {
						Game.daySubscribers [key] (currDate);
					}
				}
				Farmer.Finance.financeEveryday (currDate);
				Game.date = currDate;
			}, 1000);
			var prevTime = Date.now ();
			var tick = function () {
				var currTime = Date.now ();
				var diff = currTime - prevTime;
				prevTime = currTime;
				Game.render (diff);
				requestAnimationFrame (tick);
				Farmer.Timer.frame (diff);
			};
			$('.btn-build').on ('click', function () {
				$('.build-bar').animate ({
					left: 0
				});
				Farmer.Game.sounds.interface1.play ();
			});
			$('.btn-pointer').on ('click', function () {
				map.setPointerMode ();
				Farmer.Game.sounds.interface1.play ();
			});

			$('.btn-finance').on ('click', function () {
				new Farmer.InfoView ({
					title: 'Finance',
					showThumb: false,
					infoList: Farmer.Finance.getInfo (),
					actions: Farmer.Finance.getActions (),
					obj: Farmer.Finance
				});
				Farmer.Game.sounds.interface1.play ();
			});
			$('.build-item').on ('click', function () {
				$('.build-bar').animate ({
					left: -200
				});
				Farmer.Game.sounds.interface1.play ();
				map.setBuildMode ($(this).prop ('id'));	
				
			});
			tick ();
		},
		render: function (d) {
			var ctx = Game.ctx,
				map = Game.map;

			// console.log (d);
			ctx.fillStyle = '#000';
			ctx.fillRect (0, 0, window.innerWidth, window.innerHeight);
			$('.money').text ('$' + Farmer.Finance.balance);
			map.render (ctx);
			for (var i=0; i<Game.people.caravan.length; i++) {
				Game.people.caravan [i].render (ctx);
			}
		},

		subscribeForDay: function (cb) {
			// Hopefully unique :P fingers crossed.
			var id = (Math.random () * 99999) + '' + Date.now () + '' + Math.random () * 99999;
			Game.daySubscribers [id] = cb;
			return id;
		},

		unsubscribeForDay: function (id) {
			Game.daySubscribers = _.omit (Game.daySubscribers, id);
		}
	};
})();