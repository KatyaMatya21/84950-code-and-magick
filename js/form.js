'use strict';

(function() {
  var formContainer = document.querySelector('.overlay-container');
  var formOpenButton = document.querySelector('.reviews-controls-new');
  var formCloseButton = document.querySelector('.review-form-close');

  formOpenButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.remove('invisible');
  };

  formCloseButton.onclick = function(evt) {
    evt.preventDefault();
    formContainer.classList.add('invisible');
  };

  var userName = document.querySelector('.review-form-field-name');
  var userMark = document.querySelectorAll('input[name="review-mark"]');
  var userReview = document.querySelector('.review-form-field-text');
  var sendReview = document.querySelector('.review-submit');

  function formValid() {
    sendReview.disabled = true;
    document.querySelector('.review-fields').style.display = 'inline-block';
    var userMarkActive = document.querySelector('input[name="review-mark"]:checked');
    if (parseInt(userMarkActive.value, 10) < 3) {
      userReview.required = true;
      if ( userReview.value.length < 1 ) {
        return true;
      }
    }else {
      userReview.required = false;
    }
    if (userName.value.length < 1) {
      return true;
    }
    sendReview.disabled = false;
    document.querySelector('.review-fields').style.display = 'none';
  }

  for (var i = 0; i < userMark.length; i++ ) {
    userMark[i].onclick = formValid;
  }
  userName.onkeyup = function() {
    if (userName.value.length < 1) {
      document.querySelector('.review-fields-name').style.display = 'inline-block';
    }else {
      document.querySelector('.review-fields-name').style.display = 'none';
    }

    formValid();

  };
  userReview.onkeyup = function() {
    formValid();
    if (userReview.required === true) {
      if (userReview.value.length < 1) {
        document.querySelector('.review-fields-text').style.display = 'inline-block';
      }else {
        document.querySelector('.review-fields-text').style.display = 'none';
      }
    }else {
      document.querySelector('.review-fields-text').style.display = 'none';
    }
  };
})();
