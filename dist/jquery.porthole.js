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

            this.options = options;
            this._viewport = viewport;
            this._initialized = false;
            this.init();
        }

        _createClass(Porthole, [{
            key: 'getCurrentPos',
            value: function getCurrentPos() {
                return this._posGet();
            }
        }, {
            key: 'getStatus',
            value: function getStatus() {
                return {
                    initialized: this._initialized
                };
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
                if (this._container == undefined) {
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
                if (this._container != undefined) {
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
                this._posLast = {
                    left: -this.options.posStart[0],
                    top: -this.options.posStart[1]
                };
                this._posSet(this._posLast);
            }
        }, {
            key: '_posGet',
            value: function _posGet() {
                var _this = this;

                var _ref2 = (function () {
                    var _ref = [];
                    var _iteratorNormalCompletion = true;
                    var _didIteratorError = false;
                    var _iteratorError = undefined;

                    try {
                        for (var _iterator = _this._$container.css('transform').split(', ').slice(-2)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                            var i = _step.value;

                            _ref.push(parseInt(i));
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

                    return _ref;
                })();

                var _ref22 = _slicedToArray(_ref2, 2);

                var left = _ref22[0];
                var top = _ref22[1];

                return {
                    left: left,
                    top: top
                };
            }
        }, {
            key: '_posSet',
            value: function _posSet(_ref3) {
                var left = _ref3.left;
                var top = _ref3.top;
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
            key: '_getPointerXY',
            value: function _getPointerXY(e) {
                var x = e.pageX || e.originalEvent.touches[0].pageX,
                    y = e.pageY || e.originalEvent.touches[0].pageY;
                return [x, y];
            }
        }, {
            key: '_eventMousedown',
            value: function _eventMousedown(e) {
                var _this2 = this;

                this._dragging = true;

                var _getPointerXY2 = this._getPointerXY(e);

                var _getPointerXY22 = _slicedToArray(_getPointerXY2, 2);

                var x = _getPointerXY22[0];
                var y = _getPointerXY22[1];

                (0, _jQuery['default'])(document).on(this._dragEventName, function (e) {
                    var _getPointerXY3 = _this2._getPointerXY(e);

                    var _getPointerXY32 = _slicedToArray(_getPointerXY3, 2);

                    var xx = _getPointerXY32[0];
                    var yy = _getPointerXY32[1];

                    _this2._posSet({
                        left: xx - x + _this2._posLast['left'],
                        top: yy - y + _this2._posLast['top']
                    });

                    if (typeof _this2.options.onDrag !== 'undefined') {
                        _this2.options.onDrag(_this2);
                    };
                });

                if (typeof this.options.onDragStart !== 'undefined') {
                    this.options.onDragStart(this);
                };
            }
        }, {
            key: '_eventMouseup',
            value: function _eventMouseup() {
                if (this._dragging === true) {
                    this._dragging = false;
                    this._posLast = this._posGet();
                    (0, _jQuery['default'])(document).off(this._dragEventName);

                    if (typeof this.options.onDragStop !== 'undefined') {
                        this.options.onDragStop(this);
                    }
                };
            }
        }, {
            key: '_eventsBind',
            value: function _eventsBind() {
                var _this3 = this;

                this._dragStartEventName = 'touchstart.' + this._container + ' mousedown.' + this._container;
                this._dragStopEventName = 'touchend.' + this._container + ' mouseup.' + this._container;
                this._dragEventName = 'touchmove.' + this._container + ' mousemove.' + this._container;

                this._$container.on(this._dragStartEventName, function (e) {
                    _this3._eventMousedown(e);
                });
                (0, _jQuery['default'])(document).on(this._dragStopEventName, function () {
                    _this3._eventMouseup();
                });
            }
        }, {
            key: '_eventsUnbind',
            value: function _eventsUnbind() {
                var container = '.' + this._container;
                this._$container.off(container);
                (0, _jQuery['default'])(document).off(container);
            }
        }]);

        return Porthole;
    })();

    exports.Porthole = Porthole;
    ;

    _jQuery['default'].fn.porthole = function (options) {
        options = _jQuery['default'].extend({
            posStart: [0, 0],
            onDrag: undefined,
            onDragStart: undefined,
            onDragStop: undefined
        }, options);

        return new Porthole(this, options);
    };
});