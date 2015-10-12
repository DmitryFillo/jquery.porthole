===============
jquery.porthole
===============

Simply and fast viewport plugin for jQuery which using css transforms.

If you have large size content that should be placed into the small viewport,
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

You should include the plugin to the page, something like this:

.. code:: html

    <script src="bower_components/jquery/dist/jquery.min.js"></script>
    <script src="bower_components/jquery.porthole/dist/jquery.porthole.min.js"></script>
    <script>
        var porthole = $('#viewport').porthole();
        // ...
    </script>

*If you are using js builders, e.g. gulp, grunt, some framework assets system, etc,
you should have no problems with this plugin. Also it supports AMD/RequireJS, CommonJS, ES6 modules
(and, of course, globals).*

API
===

Porthole object has ``options`` property which is an object with:

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

porthole.options.startPos
-------------------------

Start position coordinates.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        startPos: [10, 10]
    });

    // Or attach directly to the options object and update porthole (see info below about update)
    porthole.options.startPos = [10, 20];
    porthole.update();

Default is ``[0, 0]``.

porthole.options.onDrag
-----------------------

This method will be fired when dragging (mousemove/touchmove) event occurs.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        onDrag: function(o) {
            /* 
                o is the porthole object.
            */ 
        }
    });

porthole.options.onDragStart
----------------------------

This method will be fired when drag start (mousedown/touchstart) event occurs.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        onDragStart: function(o) {
            /* 
                o is the porthole object.
            */ 
        }
    });

porthole.options.onDragStop
---------------------------

This method will be fired when drag stop (mouseup/touchend) event occurs.

.. code:: javascript

    var porthole = $('#viewport').porthole({
        onDragStop: function(o) {
            /* 
                o is the porthole object.
            */ 
        }
    });

porthole.destroy
----------------

Destroy method. You can use it for destroy the porthole and render back to the initial state.

porthole.init
-------------

Initialization method. Automatically fires in the constructor. You can use it for
manual init after destroy.

porthole.update
---------------

Update method. Useful for update the porthole after options change. Simply fires
``destroy()`` first and ``init()`` after.

porthole.getCurrentPos
----------------------

Gets current porthole position. Actually it is css transform coordinates.

Example:

.. code:: javascript

    porthole.getCurrentPos();
    /*
        Example: Object {left: -219, top: -71}
    */

porthole.getStatus
------------------

Gets current porthole status. Returns object with status properties. There are:

+ initialized (it's ``false`` after ``destroy()``, otherwise it's ``true``)

Example:

.. code:: javascript

    porthole.getStatus();
    /*
        Prints: Object {initialized: true};
    */

    porthole.destroy();

    porthole.getStatus();
    /*
        Prints: Object {initialized: false};
    */

    porthole.update();

    porthole.getStatus();
    /*
        Prints: Object {initialized: true};
    */
