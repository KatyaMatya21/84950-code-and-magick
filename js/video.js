/* global define: true */

'use strict';

define([
  'photo'
], (function(Photo) {
  /**
   * Конструктор Video
   * @constructor
   * @extends {Photo)
   */
  var Video = function() {
    this.type = 'video';
  };

  Video.prototype = new Photo();

  return Video;
}));



