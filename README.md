jquery.porthole
===

Simply and fast viewport plugin for jQuery which using css transforms and throttle.

Demo
---

http://dmitryfillo.github.io/jquery.porthole/

How to use
---

For example, you have HTML something like this: `<div class="small"><div class="large">...</div></div>`

So add script: `var P = $('.small').porthole({ start: [0, 0], callback : function(object) { console.log('loaded'); } });`

You see two params: ```start``` is for initial [x, y] of child area and ```callback``` which will be executed after initialization.

Be aware that images in ```<img>``` tag must be [non-selectable](https://developer.mozilla.org/en-US/docs/Web/CSS/user-select) due to allow moving.

In the theory, parent div can contain any number of child, but you should experiment with it and if something will go wrong please report issue.

API
---

```P.update()``` for update viewport if something changed.<br>
```P.destroy()``` for destroy viewport and back to initial state of layout.<br>
```P.init()``` for init after destroy.

Throttle
---

You can use https://github.com/cowboy/jquery-throttle-debounce, simply add this script before jquery.porthole and it will automatically work.

TODO
--

No mobile (touchevents), AMD and bower support now. Coming soon!
