var http = require('http');
var fs = require('fs');

http.createServer(function(req, res) {
	if(fs.existsSync('.' + req.url)) {
		if(req.url.match('.json')) {
			res.setHeader('Content-Type', 'application/json');
		} else if(req.url.match('.css')) {
			res.setHeader('Content-Type', 'text/css');
		} else if(req.url.match('.html')) {
			res.setHeader('Content-Type', 'text/html');
		} else if(req.url.match('.js')) {
			res.setHeader('Content-Type', 'text/javascript');
			
			console.log('json set')
		} else if(req.url.match('.gif')) {
			res.setHeader('Content-Type', 'image/gif');
			res.end(fs.readFileSync('.' + req.url));
			return;	
		}
		res.statusCode = 200;
		if(req.url === '/') {
			req.url = '/index.html';
		}
		console.log(req.url);
		res.end(fs.readFileSync('.' + req.url, 'utf-8'));
	} else {
		console.log(req.url + ' not found!');
		res.statusCode = 404;
		res.end();
	}
}).listen(8080);