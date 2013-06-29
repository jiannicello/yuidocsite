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
 .search .result .className,.search .result .type{color:#afafaf;font-size:11px}
 .search .result .type{background:#bfbfbf;border-radius:3px;color:#fff;padding:1px 4px 1px}
 .search .yui3-aclist-item-active .result .type{background:#fff;color:#333}
 
 .search .result .description{font-size:11px; overflow:hidden;}
 .search .result .title{display:inline;margin:0 50px 0 0}
 .search .result .type{position:absolute;right:0;top:3px}
 .search .result .yui3-highlight{color:#00f}
 .search .yui3-aclist-item-active .yui3-highlight{color:#bfdaff}#main-nav{line-height:1.5;margin:12px 0 -2px 0;zoom:1}
 */});