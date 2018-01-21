'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var cheerio = require('cheerio'); //Jquery for Node
var reqpro = require('request-promise'); // Request
var fs = require('fs');
var Table = require('cli-table');

var Spider = function () {
    function Spider() {
        var _this = this;

        var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

        _classCallCheck(this, Spider);

        //properties
        this.props = {
            showStats: obj.showStats || true,
            setVisit: obj.setVisit || function (url) {
                return {
                    url: url
                };
            },
            isVisit: obj.isVisit || function (obj, url) {
                return obj.url == url;
            },
            proxy: obj.proxy || false
        };

        this.rp = obj.proxy ? reqpro : reqpro.defaults({ proxy: obj.proxy });

        //states
        this.state = {
            visited: obj.visited || [],
            isVisited: function isVisited(url) {
                if (_this.state.visited.findIndex(function (el) {
                    return _this.props.isVisit(el, url);
                }) == -1) {
                    _this.state.visited.push(_this.props.setVisit(url));
                    return 0;
                } else {
                    return 1;
                }
            }
        };

        this.stats = {
            downloaded: 0, //
            success: 0, //succesful scraping
            failure: 0, // failurds
            skipped: 0 //Skipped due to visiting
        };
    }

    _createClass(Spider, [{
        key: 'print',
        value: function print() {

            var tableDesign = {
                head: ['Crawled Pages', 'Failed Crawls', 'Skipped Crawls', 'Downloaded' /*, 'Crawled Pages(from Beginning)'*/]
                // , colWidths: [100, 200]
            };

            if (this.props.showStats) {
                var table = new Table(tableDesign);
                var x = this.stats;
                table.push([x.success, x.failure, x.skipped, x.downloaded /*, this.state.visited.length*/]);
                console.log(table.toString());
            }
        }
    }, {
        key: 'download',
        value: function () {
            var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(url) {
                var _this2 = this;

                var path = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : './';
                var filename = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;
                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                return _context2.abrupt('return', new Promise(function () {
                                    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(resolve, reject) {
                                        var res;
                                        return regeneratorRuntime.wrap(function _callee$(_context) {
                                            while (1) {
                                                switch (_context.prev = _context.next) {
                                                    case 0:
                                                        filename = filename ? filename + '.' + url.split('.').pop() : url.split('/').pop();

                                                        _context.prev = 1;
                                                        _context.next = 4;
                                                        return _this2.rp({ uri: url, encoding: null });

                                                    case 4:
                                                        res = _context.sent;

                                                        fs.writeFile(path + '/' + filename, res, 'binary', function (err) {
                                                            _this2.stats.downloads++;
                                                            _this2.print();
                                                            if (err) reject(err);else resolve();
                                                        });

                                                        _context.next = 11;
                                                        break;

                                                    case 8:
                                                        _context.prev = 8;
                                                        _context.t0 = _context['catch'](1);

                                                        reject(_context.t0);

                                                    case 11:
                                                    case 'end':
                                                        return _context.stop();
                                                }
                                            }
                                        }, _callee, _this2, [[1, 8]]);
                                    }));

                                    return function (_x5, _x6) {
                                        return _ref2.apply(this, arguments);
                                    };
                                }()));

                            case 1:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));

            function download(_x4) {
                return _ref.apply(this, arguments);
            }

            return download;
        }()
    }, {
        key: 'crawl',
        value: function () {
            var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(pageurl) {
                var _this3 = this;

                return regeneratorRuntime.wrap(function _callee4$(_context4) {
                    while (1) {
                        switch (_context4.prev = _context4.next) {
                            case 0:
                                return _context4.abrupt('return', new Promise(function () {
                                    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(resolve, reject) {
                                        var resp;
                                        return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                            while (1) {
                                                switch (_context3.prev = _context3.next) {
                                                    case 0:
                                                        if (_this3.state.isVisited(pageurl)) {
                                                            _this3.stats.skipped++;
                                                            _this3.print();
                                                            resolve();
                                                        }

                                                        _context3.prev = 1;
                                                        _context3.next = 4;
                                                        return _this3.rp({ uri: pageurl, transform: function transform(body) {
                                                                return cheerio.load(body);
                                                            } });

                                                    case 4:
                                                        resp = _context3.sent;

                                                        _this3.stats.success++;
                                                        _this3.print();
                                                        resolve(resp);
                                                        _context3.next = 16;
                                                        break;

                                                    case 10:
                                                        _context3.prev = 10;
                                                        _context3.t0 = _context3['catch'](1);

                                                        _this3.state.failure++;
                                                        throw _context3.t0;

                                                    case 16:
                                                    case 'end':
                                                        return _context3.stop();
                                                }
                                            }
                                        }, _callee3, _this3, [[1, 10]]);
                                    }));

                                    return function (_x8, _x9) {
                                        return _ref4.apply(this, arguments);
                                    };
                                }()));

                            case 1:
                            case 'end':
                                return _context4.stop();
                        }
                    }
                }, _callee4, this);
            }));

            function crawl(_x7) {
                return _ref3.apply(this, arguments);
            }

            return crawl;
        }()
    }]);

    return Spider;
}();

module.exports = Spider;