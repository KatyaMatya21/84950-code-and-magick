'use strict';

(function() {
  /**
   * Конструктор Photo
   * @constructor
   */
  var Photo = function() {
    this._url = null;
  };

  Photo.prototype.setUrl = function(url) {
    this._url = url;
  };

  Photo.prototype.getUrl = function() {
    return this._url;
  };

  window.Photo = Photo;
})();



