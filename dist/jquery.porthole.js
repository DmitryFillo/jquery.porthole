(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define(['exports', 'jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        factory(exports, require('jquery'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod.exports, global.jQuery);
        global.jqueryPorthole = mod.exports;
    }
})(this, function (exports, _jquery) {
    'use strict';

    Object.defineProperty(exports, '__esModule', {
        value: true
    });

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _jQuery = _interopRequireDefault(_jquery);

    var Porthole = (function () {
        function Porthole(viewport, options) {
            _classCallCheck(this, Porthole);

            this._options = options;
            this._viewport = viewport;
            this._initialized = false;
            this.init();
        }

        _createClass(Porthole, [{
            key: 'getCurrentPos',
            value: function getCurrentPos() {
                return this._posCur;
            }
        }, {
            key: 'getInitializedStatus',
            value: function getInitializedStatus() {
                return this._initialized;
            }
        }, {
            key: 'init',
            value: function init() {
                if (this._initialized === false) {
                    this._initialized = true;
                    this._render();
                    this._posInit();
                    this._eventsBind();
                };
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                if (this._initialized === true) {
                    this._initialized = false;
                    this._eventsUnbind();
                    this._renderBack();
                };
            }
        }, {
            key: 'update',
            value: function update() {
                this.destroy();
                this.init();
            }
        }, {
            key: '_render',
            value: function _render() {
                if (typeof this._container === 'undefined') {
                    this._$viewport = (0, _jQuery['default'])(this._viewport);
                    this._container = this._$viewport.attr('id') + '-jquery-porthole-wrapper';
                    this._$container = (0, _jQuery['default'])('<div id="' + this._container + '" style="display: inline-block;">' + this._$viewport.html() + '</div>');
                    this._viewportOverflow = this._$viewport.css('overflow');
                    this._$viewport.css('overflow', 'hidden').html(this._$container);
                };
            }
        }, {
            key: '_renderBack',
            value: function _renderBack() {
                if (typeof this._container !== 'undefined') {
                    this._$viewport.html(this._$container.html()).css('overflow', this._viewportOverflow);
                    this._container = null;
                    this._$container = null;
                    this._viewportOverflow = null;
                };
            }
        }, {
            key: '_posInit',
            value: function _posInit() {
                this._posMax = {
                    left: this._$viewport.width() - this._$container.width(),
                    top: this._$viewport.height() - this._$container.height()
                };
                this._posCur = {
                    left: -this._options.start[0],
                    top: -this._options.start[1]
                };
                this._posSet(this._posCur);
            }
        }, {
            key: '_posGet',
            value: function _posGet() {
                var _this = this;

                var a = (function () {
                    var _a = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = _this._$container.css('transform').split(', ').slice(-2)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var i = _step.value;

                            _a.push(parseInt(i));
                        }
                    } catch (err) {
                        _didIteratorError = true;
                        _iteratorError = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion && _iterator['return']) {
                                _iterator['return']();
                            }
                        } finally {
                            if (_didIteratorError) {
                                throw _iteratorError;
                            }
                        }
                    }

                    return _a;
                })();

                var _a2 = _slicedToArray(a, 2);

                var left = _a2[0];
                var top = _a2[1];

                return {
                    left: left,
                    top: top
                };
            }
        }, {
            key: '_posSet',
            value: function _posSet(_ref) {
                var left = _ref.left;
                var top = _ref.top;
                var _posMax = this._posMax;
                var leftMax = _posMax.left;
                var topMax = _posMax.top;

                left = left > 0 ? 0 : left;
                top = top > 0 ? 0 : top;
                left = left < leftMax ? leftMax : left;
                top = top < topMax ? topMax : top;

                this._$container.css('transform', 'translate3d(' + left + 'px, ' + top + 'px, 0px)');
            }
        }, {
            key: '_getXY',
            value: function _getXY(e) {
                var x = e.pageX || e.originalEvent.touches[0].pageX,
                    y = e.pageY || e.originalEvent.touches[0].pageY;
                return [x, y];
            }
        }, {
            key: '_eventMousedown',
            value: function _eventMousedown(e) {
                var _this2 = this;

                this._dragging = true;

                var _getXY2 = this._getXY(e);

                var _getXY22 = _slicedToArray(_getXY2, 2);

                var x = _getXY22[0];
                var y = _getXY22[1];

                (0, _jQuery['default'])(document).on('touchmove.' + this._container + ' mousemove.' + this._container, function (e) {
                    var _getXY3 = _this2._getXY(e);

                    var _getXY32 = _slicedToArray(_getXY3, 2);

                    var xx = _getXY32[0];
                    var yy = _getXY32[1];

                    _this2._posSet({
                        left: xx - x + _this2._posCur['left'],
                        top: yy - y + _this2._posCur['top']
                    });
                });
            }
        }, {
            key: '_eventMouseup',
            value: function _eventMouseup() {
                if (this._dragging === true) {
                    this._dragging = false;
                    this._posCur = this._posGet();
                    (0, _jQuery['default'])(document).off('touchmove.' + this._container + ' mousemove.' + this._container);
                };
            }
        }, {
            key: '_eventsBind',
            value: function _eventsBind() {
                var _this3 = this;

                this._$container.on('touchstart.' + this._container + ' mousedown.' + this._container, function (e) {
                    _this3._eventMousedown(e);
                });
                (0, _jQuery['default'])(document).on('touchend.' + this._container + ' mouseup.' + this._container, function () {
                    _this3._eventMouseup();
                });
            }
        }, {
            key: '_eventsUnbind',
            value: function _eventsUnbind() {
                this._$container.off('.' + this._container);
                (0, _jQuery['default'])(document).off('.' + this._container);
            }
        }]);

        return Porthole;
    })();

    exports.Porthole = Porthole;
    ;

    _jQuery['default'].fn.porthole = function (options) {
        options = _jQuery['default'].extend({
            start: [0, 0]
        }, options);

        return new Porthole(this, options);
    };
});