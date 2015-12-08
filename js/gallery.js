'use strict';

(function() {

  /**
   * Галерея
   * @constructor
   */
  var Gallery = function() {
    this.element = document.querySelector('.overlay-gallery');
    this._left = this.element.querySelector('.overlay-gallery-control-left');
    this._right = this.element.querySelector('.overlay-gallery-control-right');
    this._closeGallery = this.element.querySelector('.overlay-gallery-close');
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
    this._left.addEventListener('click', this._leftClick);
    this._right.addEventListener('click', this._rightClick);
    this._closeGallery.addEventListener('click', this._onCloseClick.bind(this));
    document.addEventListener('keydown', this._closeGalleryEsc.bind(this));
  };

  /**
   * Удаление элементов управления
   */
  Gallery.prototype.removeControls = function() {
    this._left.removeEventListener('click', this._leftClick);
    this._right.removeEventListener('click', this._rightClick);
    this._closeGallery.removeEventListener('click', this._onCloseClick.bind(this));
    document.removeEventListener('keydown', this._closeGalleryEsc.bind(this));
  };

  /**
   * Левый
   */
  Gallery.prototype._leftClick = function() {
    console.log('left click');
  };

  /**
   * Правый
   */
  Gallery.prototype._rightClick = function() {
    console.log('right click');
  };

  /**
   * Закрытие
   */
  Gallery.prototype._onCloseClick = function() {
    this.hide();
  };

  /**
   * Закрытие по esp
   */
  Gallery.prototype._closeGalleryEsc = function(evt) {
    if (evt.keyCode === 27) {
      this.hide();
    }
  };

  window.Gallery = Gallery;
})();
