/* global Photo: true*/

'use strict';

(function() {
  /**
   * Конструктор Video
   * @constructor
   * @extends {Photo)
   */
  var Video = function() {
    this.type = 'video';
  };

  Video.prototype = new Photo();

  window.Video = Video;
})();



