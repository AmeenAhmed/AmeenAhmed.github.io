(function () {
	var Worker = Farmer.Worker = function (_options) {
		var self = this;

		var options = self.options = _.extend ({
			workingAt: null,
			name: Farmer.Names.firstnames[Math.floor (Math.random () * Farmer.Names.firstnames.length)] + ' ' +
					Farmer.Names.lastnames[Math.floor (Math.random () * Farmer.Names.lastnames.length)]
		}, _options);

		Farmer.Game.people.workers.push (self);
	};
}) ();