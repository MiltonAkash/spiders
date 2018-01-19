'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var cheerio = require('cheerio');
var reqpro = require('request-promise');
var fs = require('fs');
var Table = require('cli-table');
var rp = reqpro;

var spider = {};
spider.props = {
    showStats: true,
    proxy: false,
    visited: [],
    isVisited: function isVisited(current) {
        var visited = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : spider.props.visited;
        return visited.indexOf(current);
    }
};

var TableObject = {
    head: ['Total', 'Success', 'Failure', 'New visits', 'Aldready Visited']
    // , colWidths: [100, 200]
};

spider.defaults = function (def) {
    rp = reqpro.defaults({ proxy: def.proxy });
    Object.assign.apply(Object, [spider.props].concat(_toConsumableArray(def)));
};

spider.state = {
    visited: spider.props.visited,
    isVisited: spider.props.isVisited,
    stats: {
        downloads: 0,
        success: 0,
        failure: 0,
        visited: 0,
        skipped: 0
    }

};
spider.print = function () {
    var table = new Table(TableObject);
    var x = spider.state.stats;
    table.push([x.success + x.failure + x.visited + x.skipped, x.success, x.failure, x.visited, x.skipped]);
    console.log(table.toString());
};
spider.print();

spider.crawl = function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(pageurl, callback) {
        var resp;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        _context.prev = 0;
                        _context.next = 3;
                        return rp({ uri: pageurl, transform: function transform(body) {
                                return cheerio.load(body);
                            } });

                    case 3:
                        resp = _context.sent;

                        if (!callback) {
                            _context.next = 8;
                            break;
                        }

                        callback(resp);
                        _context.next = 9;
                        break;

                    case 8:
                        return _context.abrupt('return', new Promise(function (resolve, reject) {
                            resolve(resp);
                        }));

                    case 9:
                        _context.next = 14;
                        break;

                    case 11:
                        _context.prev = 11;
                        _context.t0 = _context['catch'](0);
                        throw _context.t0;

                    case 14:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, undefined, [[0, 11]]);
    }));

    return function (_x2, _x3) {
        return _ref.apply(this, arguments);
    };
}();

spider.download = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url, callback) {
        var path = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : './';
        var filename = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;
        var name, ext, res;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        name = filename || url.split('/').pop();
                        ext = url.split('.').pop();
                        _context2.prev = 2;
                        _context2.next = 5;
                        return rp({ uri: url, encoding: null });

                    case 5:
                        res = _context2.sent;

                        fs.writeFile(path + name + '.' + ext, res, 'binary', callback);
                        _context2.next = 12;
                        break;

                    case 9:
                        _context2.prev = 9;
                        _context2.t0 = _context2['catch'](2);
                        throw _context2.t0;

                    case 12:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, undefined, [[2, 9]]);
    }));

    return function (_x6, _x7) {
        return _ref2.apply(this, arguments);
    };
}();

/*
spider.crawl('https://www.npmjs.com/package/console.table',($)=>{
    console.log($('h1').text());
});*/