'use strict';

var PATH_TO_DATA_FILE = './docs/data.json',
    fs = require('fs'),
    lang = require('./lib/lang');

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
            if (err) {
                console.log('error loading json: ' + err);
            } else {
                that.raw_data = JSON.parse(data);

                //sort classitems by name
                that.raw_data.classitems.sort(function (classitem1, classitem2) {
                    var val1 = classitem1.name.toLowerCase(),
                        val2 = classitem2.name.toLowerCase();

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
    } //end load
};