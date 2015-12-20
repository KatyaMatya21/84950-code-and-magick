/* global Gallery: true, Photo: true, Video: true */

'use strict';

(function() {
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

  initGallery();

})();
