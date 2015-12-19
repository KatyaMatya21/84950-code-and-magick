/* global define: true */

'use strict';

define([], (function() {
  /**
   * Конструктор ReviewData
   * @constructor
   */

  var ReviewData = function() {};

  ReviewData.prototype.setData = function(data) {
    this._data = data;
  };

  ReviewData.prototype.getRating = function() {
    return this._data.rating;
  };

  ReviewData.prototype.setReviewRating = function(rating) {
    this._data['review-rating'] = rating;
  };

  ReviewData.prototype.getReviewRating = function() {
    return this._data['review-rating'];
  };

  ReviewData.prototype.getDate = function() {
    return this._data.date;
  };

  ReviewData.prototype.getDescription = function() {
    return this._data.description;
  };

  ReviewData.prototype.getAuthor = function() {
    return this._data.author;
  };

  ReviewData.prototype.getAuthorName = function() {
    return this.getAuthor().name;
  };

  ReviewData.prototype.getAuthorPicture = function() {
    return this.getAuthor().picture;
  };

  return ReviewData;
}));

