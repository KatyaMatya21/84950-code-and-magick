/* global Review: true */

'use strict';
(function() {

  /**
   * @type {Element}
   */
  var container = document.querySelector('.reviews-list');
  /**
   * @type {Element}
   */
  var filterBlock = document.querySelector('.reviews-filter');
  /**
   * @type {string}
   */
  var activeFilter = localStorage.getItem('activeFilter') || 'filter-all';
  /**
   * @type {Array}
   */
  var loadedReviews = [];
  /**
   * @type {Element}
   */
  var reviewsContainer = document.querySelector('.reviews');
  /**
   * @type {number}
   */
  var currentPage = 0;
  /**
   * @type {number}
   */
  var PAGE_SIZE = 3;
  /**
   * @type {Array}
   */
  var filteredReviews = [];
  /**
   * @type {Array}
   */
  var pageReviews = [];
  /**
   * @type {Element}
   */
  var moreReviews = document.querySelector('.reviews-controls-more');

  /**
   * Обработчик по клику
   * Фильтры отзывов
   */
  filterBlock.addEventListener('click', function(evt) {
    var target = evt.target;
    if (target.tagName === 'INPUT') {
      var clickedElementID = target.id;
      setActiveFilter(clickedElementID);
    }
  });

  filterBlock.classList.add('invisible');

  /**
   * Обработчик по клику
   * Подгрузка больше отзывов
   */
  moreReviews.onclick = function() {
    if (currentPage < Math.ceil(filteredReviews.length / PAGE_SIZE)) {
      renderReviews(filteredReviews, ++currentPage);
    }
  };

  getReviews();

  function clearReviews() {
    pageReviews.forEach(function(item) {
      item.destroy();
    });
    container.innerHTML = '';
    var allInputs = document.querySelectorAll('.reviews-filter input[type="checkbox"]');
    [].forEach.call(allInputs, function(input) {
      input.removeAttribute('checked');
    });
  }

  /**
   * Отрисовка списка отзывов
   * @param {Array} reviews
   * @param {number} pageNumber
   */
  function renderReviews(reviews, pageNumber) {
    /**
     * @type {DocumentFragment}
     */
    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    pageReviews = reviews.slice(from, to);

    pageReviews.forEach(function(reviewInfo, index) {
      reviewInfo.render();
      fragment.appendChild(reviewInfo.element);
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
    /**
     * Обработчик по загрузке
     */
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      loadedReviews = JSON.parse(rawData);

      loadedReviews = loadedReviews.map(function(review) {
        var newReview = new Review();
        newReview.setData(review);
        return newReview;
      });
      // Отрисовка загруженных данных
      filteredReviews = loadedReviews.slice(0);
      setActiveFilter(activeFilter);
      //renderReviews(loadedReviews, 0);
      reviewsContainer.classList.remove('reviews-list-loading');
    };
    /**
     * Обработчик по ошибке
     */
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

    clearReviews();

    // Сортировка и фильтрация
    currentPage = 0;
    filteredReviews = loadedReviews.slice(0);

    switch (id) {
      case 'reviews-all':
        break;
      case 'reviews-recent':
        filteredReviews = filteredReviews.filter(function(a) {
          var date = new Date(a.getDate());
          var dateCmp = new Date(Date.now() - 60 * 60 * 24 * 182 * 1000);
          return date >= dateCmp;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          var dateA = new Date(a.getDate());
          var dateB = new Date(b.getDate());
          return dateB - dateA;
        });
        break;
      case 'reviews-good':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.getRating() >= 3;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.getRating() - a.getRating();
        });
        break;
      case 'reviews-bad':
        filteredReviews = filteredReviews.filter(function(a) {
          return a.getRating() <= 2;
        });
        filteredReviews = filteredReviews.sort(function(a, b) {
          return a.getRating() - b.getRating();
        });
        break;
      case 'reviews-popular':
        filteredReviews = filteredReviews.sort(function(a, b) {
          return b.getReviewRating() - a.getReviewRating();
        });
        break;
    }

    activeFilter = id;
    document.getElementById(activeFilter).setAttribute('checked', 'checked');
    renderReviews(filteredReviews, 0);
    localStorage.setItem('activeFilter', id);
  }
})();
