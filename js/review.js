'use strict';
(function() {
  /**
   * Конструктор Отзыв
   * @param data
   * @constructor
   */
  function Review(data) {
    this._data = data;
  }

  /**
   * Создание элемента из шаблона
   */
  Review.prototype.render = function() {
    var template = document.querySelector('#review-template');

    if ('content' in template) {
      this.element = template.content.children[0].cloneNode(true);
    } else {
      this.element = template.children[0].cloneNode(true);
    }

    var reviewRating = this.element.querySelector('.review-rating');

    for (var i = 2; i <= this._data.rating; i++) {
      var reviewRatingClone = reviewRating.cloneNode(true);
      this.element.insertBefore(reviewRatingClone, reviewRating);
    }
    this.element.querySelector('.review-text').textContent = this._data.description;
    var authorImage = new Image();
    var IMAGE_TIMEOUT = 10000;

    var imageLoadTimeout = setTimeout(function() {
      authorImage.src = '';
      this.element.classList.add('review-load-failure');
    }.bind(this), IMAGE_TIMEOUT);

    // Изображение
    authorImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      var oldImg = this.element.querySelector('.review-author');
      this.element.replaceChild(authorImage, oldImg);
    }.bind(this);

    authorImage.onerror = function() {
      clearTimeout(imageLoadTimeout);
      this.element.classList.add('review-load-failure');
    }.bind(this);

    authorImage.src = this._data.author.picture;
    authorImage.title = this._data.author.name;
    authorImage.style.width = '124px';
    authorImage.style.height = '124px';
    authorImage.classList.add('review-author');
  };

  window.Review = Review;
})();
