'use strict';
//  preview.js --- модуль для отрисовки увеличенного изображения

(function () {
  //  окно галереи, кнопка закрытия окна
  var gallery = document.querySelector('.gallery-overlay');
  var galleryCloseIcon = gallery.querySelector('.gallery-overlay-close');

  //  закрытие окна галереи по нажатии на Enter
  var onGalleryCloseEnterPress = function (evt) {
    if (evt.keyCode === window.keys.ENTER_KEYCODE) {
      onGalleryCloseClick();
    }
  };

  //  закрытие окна галереи по нажатии на Escape
  var onGalleryCloseEscPress = function (evt) {
    if (evt.keyCode === window.keys.ESC_KEYCODE) {
      onGalleryCloseClick();
    }
  };

  //  закрытие окна галереи и удаление ненужных обработчиков
  var onGalleryCloseClick = function () {
    gallery.classList.add('hidden');

    galleryCloseIcon.removeEventListener('click', onGalleryCloseClick);
    galleryCloseIcon.removeEventListener('keydown', onGalleryCloseEnterPress);
    document.removeEventListener('keydown', onGalleryCloseEscPress);
  };

  // делаем видимым окно галереи
  var onGalleryOpenClick = function () {
    gallery.classList.remove('hidden');
  };

  //  показ окна галереи
  window.onAnyPictureClick = function (evt) {
    evt.preventDefault();
    var clickedItem = evt.target;
    var itemStats = clickedItem.nextElementSibling.children;

    //  делаем видимым окно галереи
    onGalleryOpenClick();

    //  заполняем окно данными с выбранной фотографии
    gallery.querySelector('.gallery-overlay-image').src = clickedItem.src;
    gallery.querySelector('.likes-count').textContent = itemStats[0].textContent;
    gallery.querySelector('.comments-count').textContent = itemStats[1].textContent;

    //  закрываем по клику на крестик
    galleryCloseIcon.addEventListener('click', onGalleryCloseClick);
    //  закрываем по клику на Enter, если крестик в фокусе
    galleryCloseIcon.addEventListener('keydown', onGalleryCloseEnterPress);
    //  закрываем по клику на Escape
    document.addEventListener('keydown', onGalleryCloseEscPress);
  };

})();
