let http = require('http');

http.createServer(function (req, res) {

    if (req.url.indexOf('index.html') >=0)
    {
       console.log(__dirname)
       let fullUrl = req.headers.protocol + '://' + req.headers.host + req.url;

       res.writeHead(200, {'Content-Type': 'text/html'});
       res.sendFile("C:\\PapaWK\\js_proto\\JS\\a.html");
       // res.end('<html><head></head><body>Hello World! EveryWhere!!!! '+fullUrl+'</body></html>');

       console.log("The End");

    }
}).listen(8080);