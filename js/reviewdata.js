'use strict';

(function() {
/**
 * Конструктор Photo
 * @constructor
 */

  var ReviewData = function() {};

  /**
   * @type {?Object}
   * @private
   */
  ReviewData.prototype._data = null;

  ReviewData.prototype.render = function() {};

  ReviewData.prototype.remove = function() {};

  /**
   * @param {Object} data
   */
  ReviewData.prototype.setData = function(data) {
    this._data = data;
  };

  /**
   * @returns {Object}
   */
  ReviewData.prototype.getData = function() {
    return this._data;
  };

  window.ReviewData = ReviewData;
})();

