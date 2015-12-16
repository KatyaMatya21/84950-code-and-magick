'use strict';

(function() {
  /**
   * Конструктор Photo
   * @constructor
   */
  var Photo = function() {
    this._url = null;
    this.type = 'photo';
  };

  /**
   * @param {string} url
   */
  Photo.prototype.setUrl = function(url) {
    this._url = url;
  };

  /**
   * @returns {string}
   */
  Photo.prototype.getUrl = function() {
    return this._url;
  };

  window.Photo = Photo;
})();



