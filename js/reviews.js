/* global Review: true */

'use strict';
(function() {

  var container = document.querySelector('.reviews-list');
  var filterBlock = document.querySelector('.reviews-filter');
  var activeFilter = 'filter-all';
  var loadedReviews = [];
  var reviewsContainer = document.querySelector('.reviews');
  var currentPage = 0;
  var PAGE_SIZE = 3;
  var filteredReviews = [];
  var moreReviews = document.querySelector('.reviews-controls-more');

  filterBlock.addEventListener('click', function(evt) {
    var target = evt.target;
    if (target.tagName === 'INPUT') {
      var clickedElementID = target.id;
      setActiveFilter(clickedElementID);
    }
  });

  filterBlock.classList.add('invisible');

  moreReviews.onclick = function() {
    if (currentPage < Math.ceil(filteredReviews.length / PAGE_SIZE)) {
      renderReviews(filteredReviews, ++currentPage);
    }
  };

  getReviews();

  /**
   * Отрисовка списка отзывов
   * @param reviews
   * @param pageNumber
   * @param replace
   */
  function renderReviews(reviews, pageNumber, replace) {
    if (replace) {
      var renderedElements = container.querySelectorAll('.review');
      [].forEach.call(renderedElements, function(el) {
        container.removeChild(el);
      });
      container.innerHTML = '';
    }

    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviews.slice(from, to);

    pageReviews.forEach(function(review, index) {
      var reviewElement = new Review(review);
      reviewElement.render();
      fragment.appendChild(reviewElement.element);
      if (index === pageReviews.length - 1) {
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
      filteredReviews = loadedReviews.slice(0);
      renderReviews(loadedReviews, 0, true);
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
    currentPage = 0;
    filteredReviews = loadedReviews.slice(0);

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

    renderReviews(filteredReviews, 0, true);
  }

})();
