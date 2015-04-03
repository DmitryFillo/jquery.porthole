/*
    Simple Viewport Plugin
    Version: 2.0.0

    https://github.com/DmitryFillo/jquery.porthole
*/

(function($) {
    'use strict';
    $.fn.porthole = function(options) {
        var viewport = this,
            Porthole = function() {
                options = $.extend({
                    start: [0, 0],
                    callback: undefined
                }, options);
                this.init();
            };
        Porthole.prototype = {
            init : function() {
                if(typeof this.initialized === 'undefined') {
                    this.$viewport = $(viewport);
                    this.render();
                    this.posInit();
                    this.eventsBind();
                    options.callback(this);
                    this.initialized = true;
                };
            },
            destroy : function() {
                if(this.initialized === true) {
                    this.eventsUnbind();
                    this.renderBack();
                    this.initialized = undefined;
                };
            },
            update : function() {
                this.destroy();
                this.init();
            },
            render : function() {
                if(typeof this.container === 'undefined') {
                    this.container = this.$viewport.attr('id')+'-porthole-wrapper'
                    this.$container = $('<div id="'+this.container+'" style="display: inline-block;">'+this.$viewport.html()+'</div>');
                    this.viewportOverflow = this.$viewport.css('overflow');
                    this.$viewport.css('overflow', 'hidden').html(this.$container);
                };
            },
            renderBack : function() {
                if(typeof this.container !== 'undefined') {
                    this.$viewport.html(this.$container.html()).css('overflow', this.viewportOverflow);
                    this.container = undefined;
                    this.$container = undefined;
                    this.viewportOverflow = undefined;
                };
            },
            posInit : function() {
                this.posCur = [-options.start[0], -options.start[1]];
                this.posMax = [this.$viewport.width()-this.$container.width(), this.$viewport.height()-this.$container.height()];
                this.posSet(this.posCur[0], this.posCur[1]);
            },
            posGet : function() {
                return this.$container.css('transform').split(', ').slice(-2).map(function(i) { return parseInt(i); });
            },
            posSet : function(left, top) {
                left = left > 0 ? 0 : left;
                top = top > 0 ? 0 : top;
                left = left < this.posMax[0] ? this.posMax[0] : left;
                top = top < this.posMax[1] ? this.posMax[1] : top;
                this.$container.css('transform', 'translate3d('+left+'px, '+top+'px, 0px)');
            },
            eventMousedown : function(e) {
                this.dragging = true;
                var x = e.pageX,
                    y = e.pageY,
                    _this = this,
                    handler = function(e) { this.posSet((e.pageX-x)+this.posCur[0], (e.pageY-y)+this.posCur[1]); };
                if($.throttle) {
                    $(document).on('mousemove.'+this.container, $.throttle(20, true, function(e) { handler.call(_this, e); }));
                } else {
                    $(document).on('mousemove.'+this.container, function(e) { handler.call(_this, e); });
                }
            },
            eventMouseup : function() {
                if(this.dragging === true) {
                    this.dragging = false;
                    this.posCur = this.posGet();
                    $(document).off('mousemove.'+this.container);
                }
            },
            eventsBind : function() {
                var _this = this;
                this.$container.on('mousedown.'+this.container, function(e) { _this.eventMousedown(e); });
                $(document).on('mouseup.'+this.container, function() { _this.eventMouseup(); });
            },
            eventsUnbind : function() {
                this.$container.off('mousedown.'+this.container);
                $(document).off('mouseup.'+this.container).off('mousemove.'+this.container);
            }
        };
        return new Porthole();
    };
})(jQuery);
