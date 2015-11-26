'use strict';
(function() {

  var container = document.querySelector('.reviews-list');
  var filterBlock = document.querySelector('.reviews-filter');
  var filters = document.querySelectorAll('.reviews-filter input');
  var activeFilter = 'filter-all';
  var loadedReviews = [];
  var reviewsContainer = document.querySelector('.reviews');

  for (var i = 0; i < filters.length; i++ ) {
    filters[i].onclick = function(evt) {
      var clickedElementID = evt.target.id;
      setActiveFilter(clickedElementID);
    };
  }

  filterBlock.classList.add('invisible');

  getReviews();

  /**
   * Отрисовка списка отзывов
   * @param {Array} reviews
   */
  function renderReviews(reviews) {
    container.innerHTML = '';
    var fragment = document.createDocumentFragment();

    reviews.forEach(function(review, index) {
      var element = getElementFromTemplate(review);
      fragment.appendChild(element);
      if (index === reviews.length - 1) {
        filterBlock.classList.remove('invisible');
      }
    });
    container.appendChild(fragment);
  }

  /**
   * Загрузка списка отзывов
   */
  function getReviews() {
    var xhr = new XMLHttpRequest();
    reviewsContainer.classList.add('reviews-list-loading');
    xhr.open('GET', 'data/reviews.json');
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      loadedReviews = JSON.parse(rawData);
      // Отрисовка загруженных данных
      renderReviews(loadedReviews);
      reviewsContainer.classList.remove('reviews-list-loading');
    };
    xhr.onerror = function() {
      reviewsContainer.classList.add('reviews-load-failure');
    };
    xhr.send();
  }

  /**
   * Установка выбранного фильтра
   * @param {string} id
   */
  function setActiveFilter(id) {
    // Предотращение повторной установки того же фильтра
    if (activeFilter === id) {
      return;
    }

    // Сортировка и фильтрация
    var filteredReviews = loadedReviews.slice(0);

    switch (id) {
      case 'reviews-all':
        break;
      case 'reviews-recent':
        filteredReviews = filteredReviews.filter(function(a) {
          var date = new Date(a.date);
          var dateCmp = new Date(Date.now() - 60 * 60 * 24 * 182 * 1000);
          return date >= dateCmp;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          var dateA = new Date(a.date);
          var dateB = new Date(b.date);
          return dateB - dateA;
        });
        break;
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating >= 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.rating - a.rating;
        });
        break;
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.rating <= 2;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return a.rating - b.rating;
        });
        break;
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b['review-rating'] - a['review-rating'];
        });
        break;
    }

    renderReviews(filteredReviews);
  }

  /**
   * Создание блока по шаблону
   * @param data
   * @returns {*}
   */
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
