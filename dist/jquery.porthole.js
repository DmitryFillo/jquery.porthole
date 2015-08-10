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

    var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

    var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

    var _jQuery = _interopRequireDefault(_jquery);

    var Porthole = (function () {
        function Porthole(options, viewport) {
            _classCallCheck(this, Porthole);

            this.options = options;
            this.viewport = viewport;
            this.init();
        }

        _createClass(Porthole, [{
            key: 'init',
            value: function init() {
                if (typeof this.initialized === 'undefined') {
                    this.$viewport = (0, _jQuery['default'])(this.viewport);
                    this.render();
                    this.posInit();
                    this.eventsBind();
                    this.options.callback(this);
                    this.initialized = true;
                };
            }
        }, {
            key: 'destroy',
            value: function destroy() {
                if (this.initialized === true) {
                    this.eventsUnbind();
                    this.renderBack();
                    this.initialized = undefined;
                };
            }
        }, {
            key: 'update',
            value: function update() {
                this.destroy();
                this.init();
            }
        }, {
            key: 'render',
            value: function render() {
                if (typeof this.container === 'undefined') {
                    this.container = this.$viewport.attr('id') + '-porthole-wrapper';
                    this.$container = (0, _jQuery['default'])('<div id="' + this.container + '" style="display: inline-block;">' + this.$viewport.html() + '</div>');
                    this.viewportOverflow = this.$viewport.css('overflow');
                    this.$viewport.css('overflow', 'hidden').html(this.$container);
                };
            }
        }, {
            key: 'renderBack',
            value: function renderBack() {
                if (typeof this.container !== 'undefined') {
                    this.$viewport.html(this.$container.html()).css('overflow', this.viewportOverflow);
                    this.container = undefined;
                    this.$container = undefined;
                    this.viewportOverflow = undefined;
                };
            }
        }, {
            key: 'posInit',
            value: function posInit() {
                this.posCur = [-this.options.start[0], -this.options.start[1]];
                this.posMax = [this.$viewport.width() - this.$container.width(), this.$viewport.height() - this.$container.height()];
                this.posSet(this.posCur[0], this.posCur[1]);
            }
        }, {
            key: 'posGet',
            value: function posGet() {
                return this.$container.css('transform').split(', ').slice(-2).map(function (i) {
                    return parseInt(i);
                });
            }
        }, {
            key: 'posSet',
            value: function posSet(left, top) {
                left = left > 0 ? 0 : left;
                top = top > 0 ? 0 : top;
                left = left < this.posMax[0] ? this.posMax[0] : left;
                top = top < this.posMax[1] ? this.posMax[1] : top;
                this.$container.css('transform', 'translate3d(' + left + 'px, ' + top + 'px, 0px)');
            }
        }, {
            key: '_getXY',
            value: function _getXY(e) {
                var x = e.pageX || e.originalEvent.touches[0].pageX,
                    y = e.pageY || e.originalEvent.touches[0].pageY;
                return [x, y];
            }
        }, {
            key: 'eventMousedown',
            value: function eventMousedown(e) {
                var _this = this;

                this.dragging = true;

                var _getXY2 = this._getXY(e);

                var _getXY22 = _slicedToArray(_getXY2, 2);

                var x = _getXY22[0];
                var y = _getXY22[1];

                (0, _jQuery['default'])(document).on('touchmove.' + this.container + ' mousemove.' + this.container, function (e) {
                    var _getXY3 = _this._getXY(e);

                    var _getXY32 = _slicedToArray(_getXY3, 2);

                    var xx = _getXY32[0];
                    var yy = _getXY32[1];

                    _this.posSet(xx - x + _this.posCur[0], yy - y + _this.posCur[1]);
                });
            }
        }, {
            key: 'eventMouseup',
            value: function eventMouseup() {
                if (this.dragging === true) {
                    this.dragging = false;
                    this.posCur = this.posGet();
                    (0, _jQuery['default'])(document).off('.' + this.container);
                }
            }
        }, {
            key: 'eventsBind',
            value: function eventsBind() {
                var _this2 = this;

                this.$container.on('touchstart.' + this.container + ' mousedown.' + this.container, function (e) {
                    _this2.eventMousedown(e);
                });
                (0, _jQuery['default'])(document).on('touchend.' + this.container + ' mouseup.' + this.container, function () {
                    _this2.eventMouseup();
                });
            }
        }, {
            key: 'eventsUnbind',
            value: function eventsUnbind() {
                this.$container.off('.' + this.container);
                (0, _jQuery['default'])(document).off('.' + this.container);
            }
        }]);

        return Porthole;
    })();

    _jQuery['default'].fn.porthole = function (options) {
        options = _jQuery['default'].extend({
            start: [0, 0],
            callback: undefined
        }, options);

        return new Porthole(options, this);
    };
});