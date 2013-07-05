'use strict';

var fs = require('fs'),
    http = require('http'),
    nconf = require('nconf'),
    mime = require('mime'),
    UrlHelper = require('./lib/urlhelper').UrlHelper,
    DataSearcher = require('./lib/datasearcher').DataSearcher,
    embedder = require('./lib/embedder'),
    searcher = null;


function writeErrorResponse(res, err) {
    res.writeHead(404);
    res.end(JSON.stringify(err));
}

function writeResponse(res, data) {
    res.writeHead(200);
    res.end(data);
}

function writeResponseRedirect(res, path) {
    res.writeHead(302, {'Location': path});
    res.end();
}

function writeResponseStream(res, fullpath) {
    var readStream = null;
    
    res.writeHead(200, {'Content-Type': mime.lookup(fullpath)});
    readStream =  fs.createReadStream(fullpath);
    readStream.on('error', function(err){
        writeErrorResponse(res, err);
    });
    readStream.pipe(res);
}

nconf.argv();
console.log('nconf.get port: ' + nconf.get('port'));
console.log('nconf.get search_desc: ' + nconf.get('search_desc'));

searcher = new DataSearcher({search_desc: nconf.get('search_desc')});
searcher.load(function () {
    var port = Number(nconf.get('port'));

    http.createServer(function (req, res) {
        var urlhelper = new UrlHelper(req),
            readFile = function (fullpath, callback) {
                fs.readFile(fullpath, function (err, data) {
                    if (err) {
                        writeErrorResponse(res, err);
                    } else {
                        callback(data);
                    }
                });
            };

        console.log('---------------------');
        console.log('urlhelper.pathname: ' + urlhelper.pathname);
        console.log('urlhelper.query.q: ' + urlhelper.query.q);

        if (urlhelper.pathname === '/') {
            writeResponseRedirect(res, '/docs/index.html');
        } else if (embedder.isEmbed(urlhelper.pathname)) {
            writeResponse(res, embedder.getEmbed(urlhelper.pathname));
        } else if (urlhelper.query.q) {
            writeResponse(res, searcher.search(urlhelper.query.q));
        } else if (urlhelper.ext === '.html') {
            readFile(urlhelper.fullpath, function (data) {
                writeResponse(res, embedder.getHtmlPage(data.toString()));
            });
        } else {
            writeResponseStream(res, urlhelper.fullpath);
        }

    }).listen(port);
}); //end searcher.load
