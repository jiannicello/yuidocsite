'use strict';

var fs = require('fs'),
    http = require('http'),
    nconf = require('nconf'),
    UrlHelper = require('./lib/urlhelper').UrlHelper;


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

nconf.argv();
console.log('nconf.get port: ' + nconf.get('port'));
console.log('nconf.get search_desc: ' + nconf.get('search_desc'));

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
    console.log('urlhelper.urlstr: ' + urlhelper.urlstr);
    console.log('urlhelper.ext: ' + urlhelper.ext);
    
    if (urlhelper.urlstr === '/') {
        writeResponseRedirect(res, '/docs/index.html');
    } else if (urlhelper.ext === '.html') {
        readFile(urlhelper.fullpath, function (data) {
            writeResponse(res, data.toString());
        });
    } else {
        readFile(urlhelper.fullpath, function (data) {
            writeResponse(res, data);
        });
    }
    
}).listen(port);