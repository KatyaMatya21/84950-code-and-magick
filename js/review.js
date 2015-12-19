/* global define: true */

'use strict';

define([
  'review-data'
], (function(ReviewData) {
  /**
   * Конструктор Отзыв
   * @constructor
   * @extends {ReviewData)
   */
  function Review() {}

  Review.prototype = new ReviewData();

  /**
   * Создание элемента из шаблона
   * @override
   */
  Review.prototype.render = function() {
    var template = document.querySelector('#review-template');

    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }
    var reviewRating = this.element.querySelector('.review-rating');

    for (var i = 2; i <= this.getRating(); i++) {
      /**
       * @type {Node}
       */
      var reviewRatingClone = reviewRating.cloneNode(true);
      this.element.insertBefore(reviewRatingClone, reviewRating);
    }
    this.element.querySelector('.review-text').textContent = this.getDescription();
    var authorImage = new Image();
    /**
     * Постоянная таумаут
     * @const {number}
     */
    var IMAGE_TIMEOUT = 10000;
    var imageLoadTimeout = setTimeout(function() {
      authorImage.src = '';
      this.element.classList.add('review-load-failure');
    }.bind(this), IMAGE_TIMEOUT);

    /**
     * Обработчик по загрузке
     */
    authorImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      var oldImg = this.element.querySelector('.review-author');
      this.element.replaceChild(authorImage, oldImg);
    }.bind(this);

    /**
     * Обработчик по ошибке
     */
    authorImage.onerror = function() {
      clearTimeout(imageLoadTimeout);
      this.element.classList.add('review-load-failure');
    }.bind(this);

    authorImage.src = this.getAuthorPicture();
    authorImage.title = this.getAuthorName();
    authorImage.style.width = '124px';
    authorImage.style.height = '124px';
    authorImage.classList.add('review-author');

    // Добавление обработчиков по клику на элементы голосования
    this.element.querySelector('.review-quiz-answer-yes').addEventListener('click', this.onPositiveReviewClick.bind(this));
    this.element.querySelector('.review-quiz-answer-no').addEventListener('click', this.onNegativeReviewClick.bind(this));
  };

  Review.prototype.onPositiveReviewClick = function() {
    this.element.querySelector('.review-quiz-answer-no').classList.remove('review-quiz-answer-active');
    var ratingBefore = this.getRating();
    var ratingAfter = (ratingBefore + 1);
    this.setReviewRating(ratingAfter);
    this.element.querySelector('.review-quiz-answer-yes').classList.add('review-quiz-answer-active');
  };

  Review.prototype.onNegativeReviewClick = function() {
    this.element.querySelector('.review-quiz-answer-yes').classList.remove('review-quiz-answer-active');
    var ratingBefore = this.getRating();
    var ratingAfter = (ratingBefore - 1);
    this.setReviewRating(ratingAfter);
    this.element.querySelector('.review-quiz-answer-no').classList.add('review-quiz-answer-active');
  };

  Review.prototype.destroy = function() {
    this.element.parentNode.removeChild(this.element);
    this.element.querySelector('.review-quiz-answer-yes').removeEventListener('click', this.onPositiveReviewClick.bind(this));
    this.element.querySelector('.review-quiz-answer-no').removeEventListener('click', this.onNegativeReviewClick.bind(this));
  };

  return Review;
}));
