(function() {

	var blogCount = 1;
	var blogEnd = false;
	var lastAuthoredTime = new Date('30 Apr 2013');
	var hours = Math.floor(((new Date() - lastAuthoredTime) / (1000 * 60 * 60))); 
	var days = Math.floor(((new Date() - lastAuthoredTime) / (1000 * 60 * 60 * 24)));
	var message = 'authored ';
	console.log(hours);
	console.log(days);

	
	if(days < 1) {
		message += hours + ' hours ago';
	} else if(days === 1) {
		message += 'a day ago';
	} else if(days < 30) {
		message += days + ' days ago';
	} else if(days < 365) {
		var month = Math.floor(days / 30);
		if(month === 1) {
			message += 'a month ago'	
		} else {
			message +=  month + ' months ago';	
		}
		
	} else {
		var year = Math.floor(days / 365);
		if(year === 1) {
			message += 'a year ago';
		} else {
			message += year + ' year ago';
		}
	}

	console.log(message);

	

	function addBlog(data) {
		$blogs = $('.blogs');
		$blogs.html("");
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

	function addBlogSummary(data, num) {
		$blogs = $('.blogs');
		$blog = $('<div></div>').addClass('blog-summary');
		$header = $('<div></div>').addClass('blog-header');
		$header_info = $('<span></span>').addClass('blog-header-info');
		$blog_content = $('<span></span>').addClass('blog-content');


		$header.html(data.title).append($('<a href="#/' + num + '"><span class="read">Read More</span>'));
		$header_info.html(data.on);
		$header.append($header_info);

		$blog.append($header);

		$blog_content.html(data.summary);

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
		$('#time').html(message);
		var hash = location.hash;
		
		if(hash) {
			var blog = +hash.replace('#/', '');
			$.ajax({
				type:'GET',
				url: '/blogs/' + blog + '.json',
				success: function(data) {
					addBlog(data);
				}
			});
		} else {
			$.ajax({
				type:'GET',
				url: '/blogs/meta.json',
				success: function(data) {
					var numBlogs = data.numBlogs;
					var i = numBlogs;
					function loadBlog() {
						$.ajax({
							type:'GET',
							url: '/blogs/' + i + '.json',
							success: function(data) {
								addBlogSummary(data, i);
								if(i) {
									i--;	
									loadBlog();
								} 
								
							}
						});	
					}
					loadBlog();	
				}
			});
		}
			
		
		$(document).on('click','.read', function() {
			var hash = $(this).parent().attr('href');
			
			var blog = +hash.replace('#/', '');
			

			$.ajax({
				type:'GET',
				url: '/blogs/' + blog + '.json',
				success: function(data) {
					addBlog(data);
					$(window).scrollTop(0);
				}
			});
		});


		// $(document).scroll(function() {
		// 	if(scrollY >= ($(document).height() - $(window).height()) && !blogEnd) {
		// 		blogEnd = true;
		// 		showSpinner();
		// 		$.ajax({
		// 			type:'GET',
		// 			url: '/blogs/' + blogCount + '.json',
		// 			success: function(data) {
		// 				if(data) {
		// 					console.log(data);
		// 					addBlogSummary(data);
		// 					blogCount += 1;	
		// 					removeSpinner();
		// 					blogEnd = false;
		// 				} else {
		// 					blogEnd = true;
		// 					removeSpinner();
		// 				}
						
		// 			},
		// 			error: function() {
						
		// 				blogEnd = true;
		// 				removeSpinner();
		// 			}
		// 		});
		// 	}
		// });
	});

})();