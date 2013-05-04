(function() {

$(document).ready(function() {
		$.ajax({
			type:'GET',
			url: '/blogs/1.json',
			success: function(data) {
				alert(data);
			}
		});
	});

})();