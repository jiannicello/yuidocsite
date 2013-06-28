'use strict';

var lang = require('./lang'),
    embedContent = [],
    embedURLs = ['/css/apidocs-min.css', '/js/api-everything.js', '/js/api-list.js', '/js/api-search.js'],
    getCode = function (fnEscapedCode) {
        var code = fnEscapedCode.toString().match(/[^]*\/\*([^]*)\*\/\}$/)[1];                    
        return code;
    };
    
 embedContent[0] = getCode(function () {/*
 .search .result,.search .result .title{color:#333;font-size:13px}
 .search .result{padding:3px 0;position:relative;zoom:1; border-bottom: 1px dashed #ccc;}
 .search .result:after{clear:both;content:'.';display:block;height:0;line-height:0;visibility:hidden}
 .search .yui3-aclist-content{max-height:350px;overflow-y:auto}
 .search .yui3-aclist-item-active .result,.search .yui3-aclist-item-active .result .title{color:#fff}
 
 .search .result.class .className,.search .result.module .className{display:none}
 .search .result a{color:inherit;text-decoration:inherit}
 .search .result .className,.search .result
 
 */});