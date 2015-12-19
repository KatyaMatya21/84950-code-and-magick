/* global Review: true, Gallery: true, Photo: true, Video: true */

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
    Array.prototype.map.call( galleryList, function(photoItem) {
      if (!(photoItem.parentNode.dataset.replacementVideo)) {
        var url = photoItem.src;
        var photo = new Photo();
        photo.setUrl(url);
        photoList.push(photo);
      } else {
        var src = photoItem.parentNode.dataset.replacementVideo;
        var video = new Video();
        video.setUrl(src);
        photoList.push(video);
      }
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

    document.getElementById(activeFilter).setAttribute('checked', 'checked');
    renderReviews(filteredReviews, 0);

    activeFilter = id;
    localStorage.setItem('activeFilter', id);
  }
})();
