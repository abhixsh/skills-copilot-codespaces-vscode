// Create web server
// 1. load http module
var http = require('http');
var fs = require('fs');
var url = require('url');
var querystring = require('querystring');
var comments = [];
var server = http.createServer(function (req, res) {
  // 2. send http header
  // http status value : 200 : OK
  // content type: text/plain
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Access-Control-Allow-Origin', '*');

  // 3. send response data "Hello World"
  // res.end("Hello world\n");
  var method = req.method;
  var urlObj = url.parse(req.url, true);
  var pathName = urlObj.pathname;
  if (pathName === '/') {
    fs.readFile('./comments.html', function (err, data) {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.end(data);
      }
    });
  } else if (pathName === '/comments') {
    if (method === 'GET') {
      var data = urlObj.query;
      var comment = {
        name: data.name,
        message: data.message,
        time: new Date()
      };
      comments.push(comment);
      res.end(JSON.stringify(comments));
    } else if (method === 'POST') {
      var str = '';
      req.on('data', function (chunk) {
        str += chunk;
      });
      req.on('end', function () {
        var data = querystring.parse(str);
        var comment = {
          name: data.name,
          message: data.message,
          time: new Date()
        };
        comments.push(comment);
        res.end(JSON.stringify(comments));
      });
    }
  } else {
    fs.readFile('.' + pathName, function (err, data) {
      if (err) {
        res.statusCode = 404;
        res.end('Not Found');
      } else {
        res.end(data);
      }
    });
  }
});
// 4. bind port 8080
// IP address