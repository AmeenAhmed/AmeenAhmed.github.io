(function () {
	var OrdersView = Farmer.OrdersView = function (_options) {
		var self = this;
		var options = self.options = _.extend ({
			title: 'Default title',
			icon: '',
			ordersList: [],
			orders: [],
			actions: []
		}, _options);

		var template = _.template ($('script#order-view-template').text ());
		var listTemplate = _.template ($('script#order-list-item-template').text ());
		var html = template (options);
		var $infoView = $(html);
		$('body').append ($infoView);
		Farmer.Game.sounds.donkey.play ();
		// options.timer = Farmer.Game.subscribeForDay(function () {
		// 	// console.log ('came')
		// 	options.infoList = options.obj.getInfo ();
		// 	$infoView.find ('ul.info-list').empty ().append ($(listTemplate (options)));
		// 	for(var i=0; i<options.infoList.length; i++) {
		// 	if (options.infoList [i].type === 'link') {
		// 			$infoView.find ('li#'+i + ' a').on ('click', function () {
		// 				var id = $(this).parent ().prop ('id');
		// 				// debugger
		// 				options.infoList [id].value.obj [options.infoList [id].value.action] ();
		// 			});
		// 		}
		// 	}
		// });
		var tickTimer = null;
		if (options.obj.render) {
			tickTimer = Farmer.Timer.subscribeTick (function () {
				Farmer.Game.map.render ($infoView.find ('canvas')[0].getContext ('2d'), {
					x: options.obj.options.x - 96,
					y: options.obj.options.y - 30
				}, 1);
				options.obj.render ($infoView.find ('canvas')[0].getContext ('2d'), {
					x: options.obj.options.x  - 96,
					y: options.obj.options.y  - 30
				}, 1);
				console.log ('Still Going!!');
			});
		}

		$infoView.find ('.x-button').on ('click', function () {
			// debugger
			// Farmer.Game.unsubscribeForDay (options.timer);
			$infoView.remove ();
			Farmer.Timer.unsubscribeTick (tickTimer);
		});

		$infoView.find ('.info-button-bar-button').on ('click', function () {
			options.actions [$(this).data ('idx')].action ();
		});
		$infoView.find ('#new-order').on ('click', function () {
			// options.ordersList.push (options.orders[0]);
			options.obj.options.ordersList.push (options.orders [0]);	
			var list = $(listTemplate ({
				idx: options.ordersList.length - 1,
				orders: options.orders
			}));
			list.find ('select').on ('change', function () {
				var id = $(this).parent ().prop ('id');
				var idx = $(this).prop ('selectedIndex');

				options.obj.options.ordersList[id] = options.orders [idx];
			});
			$infoView.find ('ol.info-list').append (list);
		});

		$infoView.find ('select').on ('change', function () {
			var id = $(this).parent ().prop ('id');
			var idx = $(this).prop ('selectedIndex');

			options.obj.options.ordersList[id] = options.orders [idx];
		});

		// for(var i=0; i<options.infoList.length; i++) {
		// 	if (options.infoList [i].type === 'link') {
		// 		$infoView.find ('li#'+i + ' a').on ('click', function () {
		// 			debugger
		// 		});
		// 	}
		// }
	};
}) ();