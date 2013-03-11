/*
    Simple Viewport Plugin
    Version: 1.0.0

    It is licensed under BSD Licence.
    The license text can be found at https://github.com/DmitryPhilimonov/jquery.porthole/blob/master/LICENSE

    Author: Mr. Fillo
	    fillo at fillo dot me

    Website: http://plugins.jquery.com/porthole/
*/

(function($) {
    'use strict';

    $.fn.porthole = function(options) {

	// Do nothing if viewport already on.
	if($.portholeStatus == undefined) {
	    $.portholeStatus = true;
	} else {
	    return false;
	}

	// Extending options.
	var options = $.extend({
	    start: [0, 0],
	    callback: undefined }, options);
	options.start = options.start.map(function(p) { return -p });

	// Wrapper id.
	var wrapper_id = $(this).attr('id') + '-porthole-wrapper';

	// Wrapper prototype object (to wrap content in div).
	var wrapper_proto = {

	    // Max pos.
	    maxPos : [ ],

	    // Current pos.
	    curPos : [ ],

	    // Get position.
	    getPos : function(s) {
		var position = [
		    $(s).css('left'),
		    $(s).css('top')
		].map(function(str) { return str.replace(/px/g, '') });

		return [ parseInt(position[0]), parseInt(position[1]) ];
	    },

	    // Set position.
	    setPos : function(s, left, top) {
		left = left > 0 ? 0 : left;
		top = top > 0 ? 0 : top;
		left = left < this.maxPos[0] ? this.maxPos[0] : left;
		top = top < this.maxPos[1] ? this.maxPos[1] : top;

		$(s).css({'left' : left +'px', 'top' : top +'px'});
	    }
	};

	// Constructor for wrapper object.
	function Wrapper(viewport, wrapper) {
	    this.maxPos = [
		$(viewport).width()-$(wrapper).width(),
		$(viewport).height()-$(wrapper).height()
	    ];
	    this.curPos = this.getPos(wrapper);
	}

	Wrapper.prototype = wrapper_proto;

	// Dragging event handlers.
	var dragging = false;

	$(this).mousedown(function(e) {
	    dragging = true;

	    var x = e.pageX,
		y = e.pageY,
                handler = function(e) {
            	    $.portholeWrapper.setPos('#'+wrapper_id, (e.pageX-x)+$.portholeWrapper.curPos[0], (e.pageY-y)+$.portholeWrapper.curPos[1]);
            	}

	    // Throttling.
	    if($.throttle) {
		$(document).mousemove($.throttle(20, true, handler));
	    } else {
		$(document).mousemove(handler);
	    }

          });

	$(document).mouseup(function() {
	    if(dragging == true) {
		dragging = false;
		$(document).unbind("mousemove");
		$.portholeWrapper.curPos = $.portholeWrapper.getPos('#'+wrapper_id);
	    } else {
		return false;
	    }
	});

	// Add wrapper to html and run callback.
	$(this)
	    .css({'display' : 'none', 'overflow' : 'hidden'})
	    .html('<div id="'+ wrapper_id +'" style="display: inline-block; position: relative; left: '+ options.start[0] +'px; top: '+ options.start[1] +'px;">'+ $(this).html() +'</div>')
	    .show(0, function() {
		$.portholeWrapper = new Wrapper(this, '#'+wrapper_id);
		if(options.callback != undefined) {
		    options.callback();
		};
	    });
    };

})(jQuery);
