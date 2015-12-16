'use strict';

(function() {

  /**
   * Конструктор Галерея
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._left = this.element.querySelector('.overlay-gallery-control-left');
    this._right = this.element.querySelector('.overlay-gallery-control-right');
    this._closeGallery = this.element.querySelector('.overlay-gallery-close');
    this._photos = [];
    this._currentIndex = 0;
  };

  /**
   * Показ галереи
   */
  Gallery.prototype.show = function() {
    this.element.classList.remove('invisible');
    this.addControls();
  };

  /**
   * Закрытие галереи
   */
  Gallery.prototype.hide = function() {
    this.element.classList.add('invisible');
    this.removeControls();
  };

  /**
   * Добавление элементов управления
   */
  Gallery.prototype.addControls = function() {
    this._left.addEventListener('click', this._leftClick.bind(this));
    this._right.addEventListener('click', this._rightClick.bind(this));
    this._closeGallery.addEventListener('click', this._onCloseClick.bind(this));
    document.addEventListener('keydown', this._closeGalleryEsc.bind(this));
  };

  /**
   * Удаление элементов управления
   */
  Gallery.prototype.removeControls = function() {
    this._left.removeEventListener('click', this._leftClick.bind(this));
    this._right.removeEventListener('click', this._rightClick.bind(this));
    this._closeGallery.removeEventListener('click', this._onCloseClick.bind(this));
    document.removeEventListener('keydown', this._closeGalleryEsc.bind(this));
  };

  /**
   * Левый
   * @private
   */
  Gallery.prototype._leftClick = function() {
    var n = this._currentIndex - 1;
    if (n < 0) {
      n = this._photos.length - 1;
    }
    this.setCurrentPicture(n);
  };

  /**
   * Правый
   * @private
   */
  Gallery.prototype._rightClick = function() {
    var n = this._currentIndex + 1;
    if (n > this._photos.length - 1) {
      n = 0;
    }
    this.setCurrentPicture(n);
  };

  /**
   * Закрытие
   * @private
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Обработкичи кликов по клавиатуре
   * @private
   */
  Gallery.prototype._closeGalleryEsc = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }
    if (evt.keyCode === 37) {
      this._leftClick();
    }
    if (evt.keyCode === 39) {
      this._rightClick();
    }
  };

  /**
   * @param {Array.<Photo>} photos
   */
  Gallery.prototype.setPictures = function(photos) {
    this._photos = photos;
    this.element.querySelector('.preview-number-total').innerHTML = '' + this._photos.length;
  };

  /**
   * @param {number} i
   */
  Gallery.prototype.setCurrentPicture = function(i) {
    var currentImg = this.element.querySelector('.overlay-gallery-preview img');
    var currentVideo = this.element.querySelector('.overlay-gallery-preview video');

    if ( currentImg ) {
      this.element.querySelector('.overlay-gallery-preview').removeChild(currentImg);
    }

    if ( currentVideo ) {
      this.element.querySelector('.overlay-gallery-preview').removeChild(currentVideo);
    }

    this._currentIndex = i;

    if (this._photos[i].type === 'photo') {
      var image = document.createElement('img');
      this.element.querySelector('.overlay-gallery-preview').appendChild(image);
      image.src = this._photos[i].getUrl();
    } else {
      var video = document.createElement('video');
      var videoSource = document.createElement('source');
      videoSource.src = this._photos[i].getUrl();
      video.appendChild(videoSource);
      this.element.querySelector('.overlay-gallery-preview').appendChild(video);
      video.loop = true;
      video.play();

      video.onclick = function() {
        if (video.paused) {
          video.play();
        } else {
          video.pause();
        }
      };
    }

    this.element.querySelector('.preview-number-current').innerHTML = '' + (i + 1);

  };

  window.Gallery = Gallery;
})();
