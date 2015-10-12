===============
jquery.porthole
===============

Simply and fast viewport plugin for jQuery which using css transforms.

If you have large size content that should be placed to the small viewport,
this plugin is for you.

.. contents::

Explanatory demo
================

http://dmitryfillo.github.io/jquery.porthole/

Installation
============

The best way::

    bower install jquery.porthole

How to use
==========

You should include plugin to the page, something like this:

.. code:: html

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/jquery.porthole/dist/jquery.Porthole.min.js"></script>
    <script>
        var porthole = $('#viewport').porthole();
        // ...
    </script>

*If you are using js builders, e.g. gulp, grunt, some framework assets system, etc,
you should have no problems with this plugin. Also it supports AMD/RequireJS, CommonJS, ES6 modules
(and, of course, globals).*

Porthole API
============

Porthole object has ``options`` property which is object with:

+ startPos
+ onDrag
+ onDragStop
+ onDragStart

These properties can be assign via constructor or directly to the options object.

Also porthole object has methods:

+ init
+ destroy
+ update
+ getCurrentPos
+ getStatus

Porthole.options.startPos
-------------------------

Start porthole position coordinates.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        startPos: [10, 10]
    });

    // Or directly to the options object and update porthole (see below about update).
    porthole.options.startPos = [10, 20];
    porthole.update();

Default is ``[0, 0]``.

Porthole.options.onDrag
-----------------------

This method will be fired when dragging (mousemove/touchmove) event occurs.
It takes one argument - porthole object.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        onDrag: function(o) {
            /* 
                o is porthole object.
            */ 
        }
    });

Porthole.options.onDragStart
----------------------------

This method will be fired when drag start (mousedown/touchstart) event occurs.
It takes one argument - porthole object.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        onDragStart: function(o) {
            /* 
                o is porthole object.
            */ 
        }
    });

Porthole.options.onDragStop
---------------------------

This method will be fired when drag stop (mouseup/touchend) event occurs.
It takes one argument - porthole object.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        onDragStop: function(o) {
            /* 
                o is porthole object.
            */ 
        }
    });

Porthole.destroy
----------------

Destroy method. You can use it for destroy porthole and render back to the initial state.

Porthole.init
-------------

Initialization method. Automatically fires in the constructor. You can use it for
manually init after destroy.

Porthole.update
---------------

Update method. Useful for update porthole after options change. Simply fires
``destroy()`` first and ``init()`` after.

Porthole.getCurrentPos
----------------------

Gets current porthole position. Actually it is css transform coordinates.

Example:

.. code:: javascript

    Porthole.getCurrentPos();
    /*
        Prints: Object {left: -219, top: -71}
    */

Porthole.getStatus
------------------

Gets current porthole status. Returns object with status properties. There are
only one status property - ``initialized`` property. It's ``false`` after ``destroy()``, otherwise
it's ``true``.

Example:

.. code:: javascript

    Porthole.getStatus();
    /*
        Prints: Object {initialized: true};
    */

    Porthole.destroy();

    Porthole.getStatus();
    /*
        Prints: Object {initialized: false};
    */

    Porthole.update();

    Porthole.getStatus();
    /*
        Prints: Object {initialized: true};
    */
