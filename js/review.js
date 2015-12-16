/* global ReviewData: true */

'use strict';
(function() {
  /**
   * Конструктор Отзыв
   * @constructor
   * @extends {ReviewDate)
   */
  function Review() {

  }

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
  };

  window.Review = Review;
})();
