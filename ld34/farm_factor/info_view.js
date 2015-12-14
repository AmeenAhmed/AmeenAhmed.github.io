(function () {
	var InfoView = Farmer.InfoView = function (_options) {
		var self = this;
		var options = self.options = _.extend ({
			title: 'Default title',
			icon: '',
			infoList: [{title: 'message 1', value: '$200'}, {title: 'message 2', value: '20 Bags'}],
			actions: [{title: 'default button 1'}, {title: 'default button 2'}, {title: 'default button 3'}]
		}, _options);

		var template = _.template ($('script#info-view-template').text ());
		var listTemplate = _.template ($('script#info-list-template').text ());
		var html = template (options);
		var $infoView = $(html);
		var tickTimer = null
		$('body').append ($infoView);

		if (options.obj.options && options.obj.options.id === 'farm') {
			Farmer.Game.sounds.cow.play ();
		} else if (options.obj.options && options.obj.options.id === 'trade_depot') {
			Farmer.Game.sounds.door.play ();
		}

		if (options.obj.render) {
			tickTimer = Farmer.Timer.subscribeTick (function () {
				Farmer.Game.map.render ($infoView.find ('canvas')[0].getContext ('2d'), {
					x: options.obj.options.x * Farmer.vars.tileSize - 96,
					y: options.obj.options.y * Farmer.vars.tileSize - 10
				}, 1);
			});
		}

		options.timer = Farmer.Game.subscribeForDay(function () {
			// console.log ('came')
			options.infoList = options.obj.getInfo ();
			$infoView.find ('ul.info-list').empty ().append ($(listTemplate (options)));
			for(var i=0; i<options.infoList.length; i++) {
			if (options.infoList [i].type === 'link') {
					$infoView.find ('li#'+i + ' a').on ('click', function () {
						var id = $(this).parent ().prop ('id');
						// debugger
						options.infoList [id].value.obj [options.infoList [id].value.action] ();
					});
				}
			}
		});

		$infoView.find ('.x-button').on ('click', function () {
			// debugger
			Farmer.Game.unsubscribeForDay (options.timer);
			$infoView.remove ();
			Farmer.Timer.unsubscribeTick (tickTimer);
		});

		$infoView.find ('.info-button-bar-button').on ('click', function () {
			options.actions [$(this).data ('idx')].action ();
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