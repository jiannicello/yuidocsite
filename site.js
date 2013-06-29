﻿'use strict';

var fs = require('fs'),
    http = require('http'),
    nconf = require('nconf'),
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
        console.log('urlhelper.urlstr: ' + urlhelper.urlstr);
        console.log('urlhelper.searchTerm: ' + urlhelper.searchTerm);

        if (urlhelper.urlstr === '/') {
            writeResponseRedirect(res, '/docs/index.html');
        } else if (embedder.isEmbed(urlhelper.urlstr)) {
            writeResponse(res, embedder.getEmbed(urlhelper.urlstr));
        } else if (urlhelper.searchTerm) {
            writeResponse(res, searcher.search(urlhelper.searchTerm));
        } else if (urlhelper.ext === '.html') {
            readFile(urlhelper.fullpath, function (data) {
                writeResponse(res, embedder.getHtmlPage(data.toString()));
            });
        } else {
            readFile(urlhelper.fullpath, function (data) {
                writeResponse(res, data);
            });
        }

    }).listen(port);
}); //end searcher.load
