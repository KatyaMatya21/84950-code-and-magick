/* global Review: true, Gallery: true, Photo: true, ReviewData: true */

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
  var activeFilter = 'filter-all';
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
   * @type {Element}
   */
  var moreReviews = document.querySelector('.reviews-controls-more');
  /**
   * @type {Gallery}
   */
  var gallery = new Gallery();
  /**
   * @type {Element}
   */
  var galleryBlock = document.querySelector('.photogallery');

  function initGallery() {
    var galleryList = document.querySelectorAll('.photogallery-image img');
    var photoList = [];
    [].map.call( galleryList, function(photoItem) {
      var url = photoItem.src;
      var photo = new Photo();
      photo.setUrl(url);
      photoList.push(photo);
    });
    gallery.setPictures(photoList);
  }

  /**
   * Обработчик по клику
   * Галерея
   */
  galleryBlock.addEventListener('click', function(evt) {
    var targetPhoto = evt.target;
    if (targetPhoto.tagName === 'IMG') {
      evt.preventDefault();

      targetPhoto = targetPhoto.parentNode;
      var allPhotos = galleryBlock.querySelectorAll('a.photogallery-image');
      for ( var i = 0; i < allPhotos.length; i++ ) {
        if ( targetPhoto === allPhotos[i] ) {
          gallery.setCurrentPicture(i);
          break;
        }
      }

      gallery.show();
    }
  });

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

  initGallery();
  getReviews();

  /**
   * Отрисовка списка отзывов
   * @param {Array} reviews
   * @param {number} pageNumber
   * @param {boolean} replace
   */
  function renderReviews(reviews, pageNumber, replace) {
    if (replace) {
      var renderedElements = container.querySelectorAll('.review');
      [].forEach.call(renderedElements, function(el) {
        container.removeChild(el);
      });
      container.innerHTML = '';
    }
    /**
     * @type {DocumentFragment}
     */
    var fragment = document.createDocumentFragment();
    var from = pageNumber * PAGE_SIZE;
    var to = from + PAGE_SIZE;
    var pageReviews = reviews.slice(from, to);

    pageReviews.forEach(function(review, index) {
      /**
       * @type {Review}
       */
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
    /**
     * Обработчик по загрузке
     */
    xhr.onload = function(evt) {
      var rawData = evt.target.response;
      loadedReviews = JSON.parse(rawData);
      // Отрисовка загруженных данных
      filteredReviews = loadedReviews.slice(0);
      renderReviews(loadedReviews, 0, true);
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
