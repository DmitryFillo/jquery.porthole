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

    eventMousedown(e) {
        this.dragging = true;
        var x = e.pageX,
            y = e.pageY,
            handler = e => { this.posSet((e.pageX-x)+this.posCur[0], (e.pageY-y)+this.posCur[1]); };
        if($.throttle) {
            jQuery(document).on('mousemove.'+this.container, $.throttle(20, true, function(e) { handler(e); }));
        } else {
            jQuery(document).on('mousemove.'+this.container, function(e) { handler(e); });
        }
    }

    eventMouseup() {
        if(this.dragging === true) {
            this.dragging = false;
            this.posCur = this.posGet();
            jQuery(document).off('mousemove.'+this.container);
        }
    }

    eventsBind() {
        this.$container.on('mousedown.'+this.container, e => { this.eventMousedown(e); });
        jQuery(document).on('mouseup.'+this.container, () => { this.eventMouseup(); });
    }

    eventsUnbind() {
        this.$container.off('mousedown.'+this.container);
        jQuery(document).off('mouseup.'+this.container).off('mousemove.'+this.container);
    }
}

jQuery.fn.porthole = function(options) {
    options = jQuery.extend({
        start: [0, 0],
        callback: undefined
    }, options);

    return new Porthole(options, this);
};
