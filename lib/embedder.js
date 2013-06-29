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
 .search .yui3-aclist-item-active .yui3-highlight{color:#bfdaff}
 
 #main-nav{line-height:1.5;margin:12px 0 -2px 0;zoom:1}
 */});
 
 embedContent[1] = getCode(function () {/*
 YUI().use('node', function (Y) {
    var tabs = Y.one('#api-tabview').one('ul.tabs'),
        tabs_panel = Y.one('#api-tabview-panel');
    
    tabs.append('<li><a href="#api-everything">Everything</a></li>');
    tabs_panel.append('<ul id="api-everything" class="apis search"><li class="message">Begin typing in the search box above to see results.</li></ul>');
 });
 */});
 
 embedContent[2] = getCode(function () {/*
YUI.add('api-list', function (Y) {

var Lang   = Y.Lang,
    YArray = Y.Array,

    APIList = Y.namespace('APIList'),

    classesNode    = Y.one('#api-classes'),
    inputNode      = Y.one('#api-filter'),
    modulesNode    = Y.one('#api-modules'),
    tabviewNode    = Y.one('#api-tabview'),

    tabs = APIList.tabs = {},

    filter = APIList.filter = new Y.APIFilter({
        inputNode : inputNode,
        maxResults: 1000,

        on: {
            results: onFilterResults
        }
    }),

    search = APIList.search = new Y.APISearch({
        inputNode : inputNode,
        maxResults: 100,

        on: {
            clear  : onSearchClear,
            results: onSearchResults
        },
        enableCache: false //yuidocsite added
    }),

    tabview = APIList.tabview = new Y.TabView({
        srcNode  : tabviewNode,
        panelNode: '#api-tabview-panel',
        render   : true,

        on: {
            selectionChange: onTabSelectionChange
        }
    }),

    focusManager = APIList.focusManager = tabviewNode.plug(Y.Plugin.NodeFocusManager, {
        circular   : true,
        descendants: '#api-filter, .yui3-tab-panel-selected .api-list-item a, .yui3-tab-panel-selected .result a',
        keys       : {next: 'down:40', previous: 'down:38'}
    }).focusManager,

    LIST_ITEM_TEMPLATE =
        '<li class="api-list-item {typeSingular}">' +
            '<a href="{rootPath}{typePlural}/{name}.html">{displayName}</a>' +
        '</li>';

// -- Init ---------------------------------------------------------------------

// Duckpunch FocusManager's key event handling to prevent it from handling key
// events when a modifier is pressed.
Y.before(function (e, activeDescendant) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return new Y.Do.Prevent();
    }
}, focusManager, '_focusPrevious', focusManager);

Y.before(function (e, activeDescendant) {
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        return new Y.Do.Prevent();
    }
}, focusManager, '_focusNext', focusManager);

// Create a mapping of tabs in the tabview so we can refer to them easily later.
tabview.each(function (tab, index) {
    var name = tab.get('label').toLowerCase();

    tabs[name] = {
        index: index,
        name : name,
        tab  : tab
    };
});

// Switch tabs on Ctrl/Cmd-Left/Right arrows.
tabviewNode.on('key', onTabSwitchKey, 'down:37,39');

// Focus the filter input when the `/` key is pressed.
Y.one(Y.config.doc).on('key', onSearchKey, 'down:83');

// Keep the Focus Manager up to date.
inputNode.on('focus', function () {
    focusManager.set('activeDescendant', inputNode);
});

// Update all tabview links to resolved URLs.
tabview.get('panelNode').all('a').each(function (link) {
    link.setAttribute('href', link.get('href'));
});

// -- Private Functions --------------------------------------------------------
function getFilterResultNode() {
    return filter.get('queryType') === 'classes' ? classesNode : modulesNode;
}

// -- Event Handlers -----------------------------------------------------------
function onFilterResults(e) {
    var frag         = Y.one(Y.config.doc.createDocumentFragment()),
        resultNode   = getFilterResultNode(),
        typePlural   = filter.get('queryType'),
        typeSingular = typePlural === 'classes' ? 'class' : 'module';

    if (e.results.length) {
        YArray.each(e.results, function (result) {
            frag.append(Lang.sub(LIST_ITEM_TEMPLATE, {
                rootPath    : APIList.rootPath,
                displayName : filter.getDisplayName(result.highlighted),
                name        : result.text,
                typePlural  : typePlural,
                typeSingular: typeSingular
            }));
        });
    } else {
        frag.append(
            '<li class="message">' +
                'No ' + typePlural + ' found.' +
            '</li>'
        );
    }

    resultNode.empty(true);
    resultNode.append(frag);

    focusManager.refresh();
}

function onSearchClear(e) {
    //yuidocsite start
    var frag = Y.one('#api-everything').one('li.message');
    
    frag.empty();
    frag.setContent('Begin typing in the search box above to see results.');
    //yuidocsite end
    focusManager.refresh();
}

function onSearchKey(e) {
    var target = e.target;

    if (target.test('input,select,textarea')
            || target.get('isContentEditable')) {
        return;
    }

    e.preventDefault();

    inputNode.focus();
    focusManager.refresh();
}

function onSearchResults(e) {
    //yuidocsite replace start
    var frag = Y.one('#api-everything').one('li.message');
    
    frag.empty();
    
    if (e.results.length) {
        YArray.each(e.results, function (result) {
            frag.append(result.display);
        });
    } else {
        frag.append(
            '<li class="message">' +
                'No results found. Maybe you\'ll have better luck with a ' + 
                'different query?' +
            '</li>'
        );
    }
    //yuidocsite replace end
    
    focusManager.refresh();
}

function onTabSelectionChange(e) {
    var tab  = e.newVal,
        name = tab.get('label').toLowerCase();

    tabs.selected = {
        index: tab.get('index'),
        name : name,
        tab  : tab
    };

    switch (name) {
    case 'classes': // fallthru
    case 'modules':
        filter.setAttrs({
            minQueryLength: 0,
            queryType     : name
        });

        search.set('minQueryLength', -1);

        // Only send a request if this isn't the initially-selected tab.
        if (e.prevVal) {
            filter.sendRequest(filter.get('value'));
        }
        break;

    case 'everything':
        filter.set('minQueryLength', -1);
        search.set('minQueryLength', 1);

        if (search.get('value')) {
            search.sendRequest(search.get('value'));
        } else {
            inputNode.focus();
        }
        break;

    default:
        // WTF? We shouldn't be here!
        filter.set('minQueryLength', -1);
        search.set('minQueryLength', -1);
    }

    if (focusManager) {
        setTimeout(function () {
            focusManager.refresh();
        }, 1);
    }
}

function onTabSwitchKey(e) {
    var currentTabIndex = tabs.selected.index;

    if (!(e.ctrlKey || e.metaKey)) {
        return;
    }

    e.preventDefault();

    switch (e.keyCode) {
    case 37: // left arrow
        if (currentTabIndex > 0) {
            tabview.selectChild(currentTabIndex - 1);
            inputNode.focus();
        }
        break;

    case 39: // right arrow
        if (currentTabIndex < (Y.Object.size(tabs) - 2)) {
            tabview.selectChild(currentTabIndex + 1);
            inputNode.focus();
        }
        break;
    }
}

}, '3.4.0', {requires: [
    'api-filter', 'api-search', 'event-key', 'node-focusmanager', 'tabview'
]});

 */});