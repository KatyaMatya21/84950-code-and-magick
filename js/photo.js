'use strict';

(function() {
  /**
   * Конструктор Photo
   * @constructor
   */
  var Photo = function() {
    this._url = null;
    this.type = 'photo';
    this.name = '';
  };

  /**
   * @param {string} url
   */
  Photo.prototype.setUrl = function(url) {
    this._url = url;
    var urlArray = this._url.split('/');
    this.name = urlArray[urlArray.length - 1];
  };

  /**
   * @returns {string}
   */
  Photo.prototype.getUrl = function() {
    return this._url;
  };

  window.Photo = Photo;
})();



