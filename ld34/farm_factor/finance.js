(function () {
	var Finance = Farmer.Finance = {
		loan: 0,
		expenseList: [],
		incomeList: [],
		balance: 0,
		income: function (options) {
			Finance.balance += options.amt;
			Finance.incomeList.push (options);
			Farmer.Game.sounds.coins.play ();
		},
		expense: function (options) {
			Finance.balance -= options.amt;
			Finance.expenseList.push (options);
		},
		financeEveryday: function (date) {
			if (Finance.loan > 0) {
				Finance.expense ({
					amt: Finance.loan / 1000,
					type: 'loan_interest',
					title: 'Loan Interest',
					date: date
				});
			}
			var people = Farmer.Game.people;
			for (var key in people) {
				if (people.hasOwnProperty (key)) {
					for (var i=0; i<people [key].length; i++) {
						Finance.expense ({
							amt: Farmer.vars.wages [key],
							type: 'wage',
							title: 'Wage for ' + people[key][i].name,
							date: date
						});
					}
				}
			}
		},
		getInfo: function () {
			var info = {},
				list = [],
				titles = {};

			for (var i = 0; i<Finance.expenseList.length; i++) {
				if (!info [Finance.expenseList [i].type]) {
					info [Finance.expenseList [i].type]	= 0;
					titles [Finance.expenseList [i].type] = Finance.expenseList [i].title;
				}
				info [Finance.expenseList [i].type] -= Finance.expenseList[i].amt;
			}
			for (var i = 0; i<Finance.incomeList.length; i++) {
				if (!info [Finance.incomeList [i].type]) {
					info [Finance.incomeList [i].type]	= 0;
					titles [Finance.incomeList [i].type] = Finance.incomeList [i].title;
				}
				info [Finance.incomeList [i].type] += Finance.incomeList[i].amt;
			}


			for (var key in info) {
				list.push ({
					type: 'keyvalue',
					title: titles[key],
					value: '$' + info [key]
				});
			}
			list.push ({
				type: 'keyvalue',
				title: 'Balance',
				value: '$' + Finance.balance
			})
			return list;
		},
		getActions: function () {
			return [];
		}
	};
}) ();