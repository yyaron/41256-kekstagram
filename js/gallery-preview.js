'use strict';
//  preview.js --- модуль для отрисовки увеличенного изображения

(function () {
  //  окно галереи, кнопка закрытия окна
  var gallery = document.querySelector('.gallery-overlay');
  var galleryCloseIcon = gallery.querySelector('.gallery-overlay-close');

  //  закрытие окна галереи по нажатии на Enter
  var onGalleryCloseEnterPress = function (evt) {
    if (evt.keyCode === window.keys.ENTER_KEYCODE) {
      closeGallery();
    }
  };

  //  закрытие окна галереи по нажатии на Escape
  var onGalleryCloseEscPress = function (evt) {
    if (evt.keyCode === window.keys.ESC_KEYCODE) {
      closeGallery();
    }
  };

  var onGalleryCloseClick = function () {
    closeGallery();
  };

  //  закрытие окна галереи и удаление ненужных обработчиков
  var closeGallery = function () {
    gallery.classList.add('hidden');

    galleryCloseIcon.removeEventListener('click', onGalleryCloseClick);
    galleryCloseIcon.removeEventListener('keydown', onGalleryCloseEnterPress);
    document.removeEventListener('keydown', onGalleryCloseEscPress);
  };

  var clickedItem;

  //  показ окна галереи
  window.onAnyPictureClick = function (evt) {
    evt.preventDefault();
    clickedItem = evt.target;

    //  делаем видимым окно галереи
    openGallery(clickedItem);
  };

  window.onAnyPictureEnterPress = function (evt) {
    if (evt.keyCode === window.keys.ENTER_KEYCODE) {
      evt.preventDefault();
      clickedItem = evt.target.children[0];

      //  делаем видимым окно галереи
      openGallery(clickedItem);
    }
  };

  // делаем видимым окно галереи
  var openGallery = function (clickedItem) {
    var itemStats = clickedItem.nextElementSibling.children;

    //  заполняем окно данными с выбранной фотографии
    gallery.querySelector('.gallery-overlay-image').src = clickedItem.src;
    gallery.querySelector('.likes-count').textContent = itemStats[0].textContent;
    gallery.querySelector('.comments-count').textContent = itemStats[1].textContent;

    gallery.classList.remove('hidden');

    //  обработчик закрытия по клику на крестик
    galleryCloseIcon.addEventListener('click', onGalleryCloseClick);
    //  обработчик закрытия по клику на Enter, если крестик в фокусе
    galleryCloseIcon.addEventListener('keydown', onGalleryCloseEnterPress);
    //  обработчик закрытия по клику на Escape
    document.addEventListener('keydown', onGalleryCloseEscPress);
  };

})();
