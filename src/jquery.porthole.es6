import jQuery from 'jquery';

class Porthole {

    constructor(options, viewport) {
        this.options = options;
        this.viewport = viewport;
        this.init();
    }

    init() {
        if(typeof this.initialized === 'undefined') {
            this.$viewport = jQuery(this.viewport);
            this.render();
            this.posInit();
            this.eventsBind();
            this.options.callback(this);
            this.initialized = true;
        };
    }

    destroy() {
        if(this.initialized === true) {
            this.eventsUnbind();
            this.renderBack();
            this.initialized = undefined;
        };
    }

    update() {
        this.destroy();
        this.init();
    }

    render() {
        if(typeof this.container === 'undefined') {
            this.container = this.$viewport.attr('id')+'-porthole-wrapper'
            this.$container = jQuery('<div id="'+this.container+'" style="display: inline-block;">'+this.$viewport.html()+'</div>');
            this.viewportOverflow = this.$viewport.css('overflow');
            this.$viewport.css('overflow', 'hidden').html(this.$container);
        };
    }

    renderBack() {
        if(typeof this.container !== 'undefined') {
            this.$viewport.html(this.$container.html()).css('overflow', this.viewportOverflow);
            this.container = undefined;
            this.$container = undefined;
            this.viewportOverflow = undefined;
        };
    }

    posInit() {
        this.posCur = [-this.options.start[0], -this.options.start[1]];
        this.posMax = [this.$viewport.width()-this.$container.width(), this.$viewport.height()-this.$container.height()];
        this.posSet(this.posCur[0], this.posCur[1]);
    }

    posGet() {
        return this.$container.css('transform').split(', ').slice(-2).map(i => { return parseInt(i); });
    }

    posSet(left, top) {
        left = left > 0 ? 0 : left;
        top = top > 0 ? 0 : top;
        left = left < this.posMax[0] ? this.posMax[0] : left;
        top = top < this.posMax[1] ? this.posMax[1] : top;
        this.$container.css('transform', 'translate3d('+left+'px, '+top+'px, 0px)');
    }

    _getXY(e) {
        var x = e.pageX || e.originalEvent.touches[0].pageX,
            y = e.pageY || e.originalEvent.touches[0].pageY;
        return [x, y]
    }

    eventMousedown(e) {
        this.dragging = true;
        var [x, y] = this._getXY(e);
        jQuery(document).on(
            'touchmove.'+this.container+
            ' mousemove.'+this.container,
            e => {
                var [xx, yy] = this._getXY(e);
                this.posSet(xx-x+this.posCur[0], yy-y+this.posCur[1]);
            }
        );
    }

    eventMouseup() {
        if(this.dragging === true) {
            this.dragging = false;
            this.posCur = this.posGet();
            jQuery(document).off('.'+this.container);
        }
    }

    eventsBind() {
        this.$container.on(
            'touchstart.'+this.container+
            ' mousedown.'+this.container,
            e => {
                this.eventMousedown(e);
            }
        );
        jQuery(document).on(
            'touchend.'+this.container+
            ' mouseup.'+this.container, 
            () => {
                this.eventMouseup();
            }
        );
    }

    eventsUnbind() {
        this.$container.off('.'+this.container);
        jQuery(document).off('.'+this.container);
    }
}

jQuery.fn.porthole = function(options) {
    options = jQuery.extend({
        start: [0, 0],
        callback: undefined
    }, options);

    return new Porthole(options, this);
};
