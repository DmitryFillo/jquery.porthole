import jQuery from 'jquery';

export class Porthole {

    constructor(viewport, options) {
        this.options = options;
        this._viewport = viewport;
        this._initialized = false;
        this.init();
    }

    getCurrentPos() {
        return this._posGet();
    }

    getStatus() {
        return {
            initialized: this._initialized
        };
    }

    init() {
        if(this._initialized === false) {
            this._initialized = true;
            this._render();
            this._posInit();
            this._eventsBind();
        };
    }

    destroy() {
        if(this._initialized === true) {
            this._initialized = false;
            this._eventsUnbind();
            this._renderBack();
        };
    }

    update() {
        this.destroy();
        this.init();
    }

    _render() {
        if(this._container == undefined) {
            this._$viewport = jQuery(this._viewport);
            this._container = this._$viewport.attr('id')+'-jquery-porthole-wrapper'
            this._$container = jQuery('<div id="'+this._container+'" style="display: inline-block;">'+this._$viewport.html()+'</div>');
            this._viewportOverflow = this._$viewport.css('overflow');
            this._$viewport.css('overflow', 'hidden').html(this._$container);
        };
    }

    _renderBack() {
        if(this._container != undefined) {
            this._$viewport.html(this._$container.html()).css('overflow', this._viewportOverflow);
            this._container = null;
            this._$container = null;
            this._viewportOverflow = null;
        };
    }

    _posInit() {
        this._posMax = {
            left: this._$viewport.width()-this._$container.width(),
            top: this._$viewport.height()-this._$container.height()
        };
        this._posLast = {
            left: -this.options.posStart[0], 
            top: -this.options.posStart[1]
        };
        this._posSet(this._posLast);
    }

    _posGet() {
        var [left, top] = [ for (i of this._$container.css('transform').split(', ').slice(-2)) parseInt(i) ];
        return {
            left : left,
            top : top
        };
    }

    _posSet({left, top}) {
        var { left: leftMax, top: topMax } = this._posMax;

        left = left > 0 ? 0 : left;
        top = top > 0 ? 0 : top;
        left = left < leftMax ? leftMax : left;
        top = top < topMax ? topMax : top;

        this._$container.css('transform', 'translate3d('+left+'px, '+top+'px, 0px)');
    }

    _getPointerXY(e) {
        var x = e.pageX || e.originalEvent.touches[0].pageX,
            y = e.pageY || e.originalEvent.touches[0].pageY;
        return [x, y]
    }

    _eventMousedown(e) {
        this._dragging = true;
        var [x, y] = this._getPointerXY(e),

        jQuery(document).on(
            this._dragEventName,
            e => {
                var [xx, yy] = this._getPointerXY(e);
                this._posSet({
                    left: xx-x+this._posLast['left'], 
                    top: yy-y+this._posLast['top']
                });

                if(typeof this.options.onDrag !== 'undefined') {
                    this.options.onDrag(this);
                };
            }
        );

        if(typeof this.options.onDragStart !== 'undefined') {
            this.options.onDragStart(this);
        };
    }

    _eventMouseup() {
        if(this._dragging === true) {
            this._dragging = false;
            this._posLast = this._posGet();
            jQuery(document).off(this._dragEventName);

            if(typeof this.options.onDragStop !== 'undefined') {
                this.options.onDragStop(this);
            }
        };
    }

    _eventsBind() {
        this._dragStartEventName = 'touchstart.'+this._container+' mousedown.'+this._container;
        this._dragStopEventName = 'touchend.'+this._container+' mouseup.'+this._container;
        this._dragEventName = 'touchmove.'+this._container+' mousemove.'+this._container;

        this._$container.on(this._dragStartEventName, e => { this._eventMousedown(e); });
        jQuery(document).on(this._dragStopEventName, () => { this._eventMouseup(); });
    }

    _eventsUnbind() {
        var container = '.'+this._container;
        this._$container.off(container);
        jQuery(document).off(container);
    }
};

jQuery.fn.porthole = function(options) {
    options = jQuery.extend({
        posStart: [0, 0],
        onDrag: undefined,
        onDragStart: undefined,
        onDragStop: undefined
    }, options);

    return new Porthole(this, options);
};
