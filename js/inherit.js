
'use strict';

function inherit(child, parent) {
  var EmptyConstructor = function() {};
  EmptyConstructor.prototype = parent.prototype;
  child.prototype = new EmptyConstructor();
}

inherit();

