'use strict';
var path = require('path'),
    url = require('url'),
    qs = require('querystring');

function UrlHelper(req) {
    var getExt = function (pathname) {
            return  path.extname(pathname).toLowerCase();
        };

    this.url = url.parse(req.url);
    this.pathname = this.url.pathname;
    this.query = qs.parse(this.url.query);
    this.fullpath = process.cwd() + this.pathname;
    this.ext = getExt(this.pathname);
}

exports.UrlHelper = UrlHelper;