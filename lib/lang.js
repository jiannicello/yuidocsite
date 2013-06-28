'use strict';

function fold(func, accumulator, arr) {
    var hd = null,
        tail = null,
        accumulator_result = null;
        
    if (arr.length === 0) {
        return accumulator;
    }
    
    hd = arr[0];
    tail = arr.slice(1);
    accumulator_result = func(hd, accumulator);
    return fold(func, accumulator_result, tail);
}

function sub(template, data) {
    var func = function (key, outstr) {
            var value = data[key];
            return outstr.replace('{' + key + '}', value);
        },
        keys = Object.keys(data);
 
    return fold(func, template, keys);
}

exports.fold = fold;
exports.sub = sub;

