(function () {
	var Timer = Farmer.Timer = {
		timeElapsed: 0,
		subscribers: {},
		tickSubscribers: {},
		frame: function (d) {
			Timer.timeElapsed += d;
			for(var key in Timer.tickSubscribers) {
				if (Timer.tickSubscribers.hasOwnProperty (key)) {
					if (typeof Timer.tickSubscribers [key].cb === 'function') {
						Timer.tickSubscribers [key].cb ();
					}
				}
			}
			for(var key in Timer.subscribers) {
				if (Timer.subscribers.hasOwnProperty (key)) {
					Timer.subscribers [key].elapsed += d;

					if (Timer.subscribers [key].elapsed >= Timer.subscribers [key].ms) {
						if (typeof Timer.subscribers [key].cb === 'function') {
							Timer.subscribers [key].cb ();
						}
						if (Timer.subscribers [key].once) {
							Timer.subscribers = _.omit (Timer.subscribers, key);
						} else {
							Timer.subscribers [key].elapsed = Timer.subscribers [key].elapsed - Timer.subscribers [key].ms;
						}
					}
				}
			}
		},

		subscribeTick: function (cb) {
			// Hopefully unique :P fingers crossed.
			var id = (Math.random () * 99999) + '' + Date.now () + '' + Math.random () * 99999;
			Timer.tickSubscribers[id] = {
				cb: cb
			};
			return id;
		},

		subscribeOnce: function (cb, ms) {
			// Hopefully unique :P fingers crossed.
			var id = (Math.random () * 99999) + '' + Date.now () + '' + Math.random () * 99999;
			Timer.subscribers[id] = {
				cb: cb,
				ms: ms,
				elapsed: 0,
				once: true
			};
			return id;
		},

		subscribeRepeat: function (cb, ms) {
			// Hopefully unique :P fingers crossed.
			var id = (Math.random () * 99999) + '' + Date.now () + '' + Math.random () * 99999;
			Timer.subscribers[id] = {
				cb: cb,
				ms: ms,
				elapsed: 0,
				once: false
			};
			return id;
		},

		unsubscribeTick: function (id) {
			// debugger
			Timer.tickSubscribers = _.omit (Timer.tickSubscribers, id);
		}
	};
}) ();