'use strict';

var PATH_TO_DATA_FILE = './docs/data.json',
    fs = require('fs'),
    lang = require('./lang');

function DataSearcher(cfg) {
    this.data = [];
    this.raw_data = null;
    this.cfg = cfg;
}

DataSearcher.prototype = {
    load: function (callback) {
        console.log('DataSearcher load');
        var that = this,
            loadClassItemsData = function () {
                var classitems = that.raw_data.classitems,
                    data = that.data;

                classitems.forEach(function (obj) {
                    var dataitem = {
                        resultType: obj.itemtype,
                        url: lang.sub('/docs/classes/{class}.html#{itemtype}_{name}', obj),
                        name: obj.name,
                        description: obj.description,
                        class: obj.class
                    };
                    data.push(dataitem);
                });
            };
        //reset every time load is called
        this.data = [];
        this.raw_data = null;

        fs.readFile(PATH_TO_DATA_FILE, 'utf-8', function (err, data) {
            var getLower = function (v) {
                if (v) {
                    return v.toLowerCase();
                }

                return null;
            };
            if (err) {
                console.log('error loading json: ' + err);
            } else {
                that.raw_data = JSON.parse(data);

                //sort classitems by name
                that.raw_data.classitems.sort(function (classitem1, classitem2) {
                    var val1 = getLower(classitem1.name),
                        val2 = getLower(classitem2.name);

                    if (val1 < val2) {
                        return -1;
                    }
                    if (val1 > val2) {
                        return 1;
                    }

                    return 1;
                });

                loadClassItemsData();

                console.log('read json data');
                callback();
            }
        });
    }, //end load
    search: function (term) {
        var termLower = term.toLowerCase(),
            search_desc = (this.cfg && this.cfg.search_desc) ? this.cfg.search_desc : null,
            getLower = function (v) {
                if (v) {
                    return v.toLowerCase().replace(':', '%3a');
                }

                return null;
            },
            results = this.data.filter(function (item) {
                var nameLower = getLower(item.name),
                    descLower = null;

                if (!nameLower) {
                    return false;
                }

                if (nameLower.indexOf(termLower) > -1) {
                    return true;
                }

                if (search_desc) {
                    descLower = getLower(item.description);
                    if (descLower && descLower.indexOf(termLower) > -1) {
                        return true;
                    }
                }

                return false;
            });

        return JSON.stringify(results);
    }, //end search
    watch: function () {
        console.log('DataSearcher watch');
        var that = this;
        fs.watchFile(PATH_TO_DATA_FILE, function (curr, prev) {
            if (curr.mtime > prev.mtime) {
                console.log('DataSearcher watch: ./docs/data.json has changed. Call load().');
                that.load(function () {
                    console.log('DataSearcher: watch: data.json has been loaded');
                });
            }
        });
    }
};

exports.DataSearcher = DataSearcher;