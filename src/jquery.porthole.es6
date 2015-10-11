import jQuery from 'jquery';

export class Porthole {

    constructor(viewport, options) {
        this._options = options;
        this._viewport = viewport;
        this._initialized = false;
        this.init();
    }

    getCurrentPos() {
        return this._posCur;
    }

    getInitializedStatus() {
        return this._initialized;
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
        if(typeof this._container === 'undefined') {
            this._$viewport = jQuery(this._viewport);
            this._container = this._$viewport.attr('id')+'-jquery-porthole-wrapper'
            this._$container = jQuery('<div id="'+this._container+'" style="display: inline-block;">'+this._$viewport.html()+'</div>');
            this._viewportOverflow = this._$viewport.css('overflow');
            this._$viewport.css('overflow', 'hidden').html(this._$container);
        };
    }

    _renderBack() {
        if(typeof this._container !== 'undefined') {
            this._$viewport.html(this._$container.html()).css('overflow', this._viewportOverflow);
            this._container = null;
            this._$container = null;
            this._viewportOverflow = null;
        };
    }

    _posInit() {
        this._posMax = {
            left : this._$viewport.width()-this._$container.width(),
            top : this._$viewport.height()-this._$container.height()
        };
        this._posCur = {
            left : -this._options.start[0], 
            top : -this._options.start[1]
        };
        this._posSet(this._posCur);
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

    _getXY(e) {
        var x = e.pageX || e.originalEvent.touches[0].pageX,
            y = e.pageY || e.originalEvent.touches[0].pageY;
        return [x, y]
    }

    _eventMousedown(e) {
        this._dragging = true;
        var [x, y] = this._getXY(e);
        jQuery(document).on(
            'touchmove.'+this._container+
            ' mousemove.'+this._container,
            e => {
                var [xx, yy] = this._getXY(e);
                this._posSet({
                    left : xx-x+this._posCur['left'], 
                    top : yy-y+this._posCur['top']
                });
            }
        );
    }

    _eventMouseup() {
        if(this._dragging === true) {
            this._dragging = false;
            this._posCur = this._posGet();
            jQuery(document).off(
                'touchmove.'+this._container+
                ' mousemove.'+this._container
            );
        };
    }

    _eventsBind() {
        this._$container.on(
            'touchstart.'+this._container+
            ' mousedown.'+this._container,
            e => {
                this._eventMousedown(e);
            }
        );
        jQuery(document).on(
            'touchend.'+this._container+
            ' mouseup.'+this._container, 
            () => {
                this._eventMouseup();
            }
        );
    }

    _eventsUnbind() {
        this._$container.off('.'+this._container);
        jQuery(document).off('.'+this._container);
    }
};

jQuery.fn.porthole = function(options) {
    options = jQuery.extend({
        start: [0, 0]
    }, options);

    return new Porthole(this, options);
};
