'use strict';

function UrlHelper(req) {
    var getExt = function (urlstr) {
            var arr = urlstr.split('.'),
                lastIndex = arr.length - 1;

            if (lastIndex < 0) {
                return null;
            }

            return arr[lastIndex].toLowerCase();
        },
        getSearchTerm = function (urlstr) {
            var index = urlstr.indexOf('/api/v1/search?q='),
                arr = null;

            if (index < 0) {
                return null;
            }

            arr = /.*?q=(.*?)&/.exec(urlstr);

            return arr[1];
        };

    this.urlstr = req.url.replace('?pjax=1', '');
    this.fullpath = process.cwd() + this.urlstr;
    this.ext = getExt(this.urlstr);
    this.searchTerm = getSearchTerm(this.urlstr);
}

exports.UrlHelper = UrlHelper;