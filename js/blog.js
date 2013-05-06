(function() {

	var blogCount = 1;
	var blogEnd = false;

	function addBlog(data) {
		$blogs = $('.blogs');
		$blog = $('<div></div>').addClass('shadow').addClass('blog');
		$header = $('<div></div>').addClass('blog-header');
		$header_info = $('<span></span>').addClass('blog-header-info');
		$blog_content = $('<span></span>').addClass('blog-content');


		$header.html(data.title);
		$header_info.html(data.on);
		$header.append($header_info);

		$blog.append($header);

		$blog_content.html(data.content);

		$blog.append($blog_content);

		$blogs.append($blog);
	}

	function showSpinner() {
		var spinner = $('<div></div>').addClass('spinner');
		spinner.append($('<img src="/images/spinner.gif"></img>'));
		$('.github').append(spinner);
	}

	function removeSpinner() {
		$('.spinner').remove();
	}



	$(document).ready(function() {
		showSpinner();
		$.ajax({
			type:'GET',
			url: '/blogs/' + blogCount + '.json',
			success: function(data) {
				addBlog(data);
				blogCount += 1;
				removeSpinner();
			}
		});


		$(document).scroll(function() {
			if(scrollY >= ($(document).height() - $(window).height()) && !blogEnd) {
				showSpinner();
				$.ajax({
					type:'GET',
					url: '/blogs/' + blogCount + '.json',
					success: function(data) {
						if(data) {
							console.log(data);
							addBlog(data);
							blogCount += 1;	
							removeSpinner();
						} else {
							blogEnd = true;
							removeSpinner();
						}
						
					},
					error: function() {
						
						blogEnd = true;
						removeSpinner();
					}
				});
			}
		});
	});

})();