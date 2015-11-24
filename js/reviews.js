'use strict';
(function() {
  /* global reviews: true */

  var container = document.querySelector('.reviews-list');
  var filter = document.querySelector('.reviews-filter');
  filter.classList.add('invisible');

  reviews.forEach(function(review, index) {
    var element = getElementFromTemplate(review);
    container.appendChild(element);
    if (index === reviews.length - 1) {
      filter.classList.remove('invisible');
    }
  });

  function getElementFromTemplate(data) {
    var template = document.querySelector('#review-template');
    var element;

    if ('content' in template) {
      element = template.content.children[0].cloneNode(true);
    } else {
      element = template.children[0].cloneNode(true);
    }

    element.querySelector('.review-rating').textContent = data.rating;
    element.querySelector('.review-text').textContent = data.description;
    var authorImage = new Image();
    var IMAGE_TIMEOUT = 10000;
    var imageLoadTimeout = setTimeout(function() {
      authorImage.src = '';
      element.classList.add('review-load-failure');
    }, IMAGE_TIMEOUT);
    authorImage.onload = function() {
      clearTimeout(imageLoadTimeout);
      var oldImg = element.querySelector('.review-author');
      element.replaceChild(authorImage, oldImg);
    };
    authorImage.onerror = function() {
      clearTimeout(imageLoadTimeout);
      element.classList.add('review-load-failure');
    };
    authorImage.src = data.author.picture;
    authorImage.title = data.author.name;
    authorImage.style.width = '124px';
    authorImage.style.height = '124px';
    authorImage.classList.add('review-author');

    return element;
  }
})();
