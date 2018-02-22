'use strict';
//  preview.js --- модуль для отрисовки увеличенного изображения

(function () {

  //  окно галереи, кнопка закрытия окна
  var gallery = document.querySelector('.gallery-overlay');
  var galleryCloseIcon = gallery.querySelector('.gallery-overlay-close');

  //  закрытие окна галереи по нажатии на Enter
  var onGalleryCloseEnterPress = function (evt) {
    if (evt.keyCode === window.ENTER_KEYCODE) {
      onGalleryCloseClick();
    }
  };

  //  закрытие окна галереи по нажатии на Escape
  var onGalleryCloseEscPress = function (evt) {
    if (evt.keyCode === window.ESC_KEYCODE) {
      onGalleryCloseClick();
    }
  };

  //  закрытие окна галереи и удаление ненужный обработчиков
  var onGalleryCloseClick = function () {
    gallery.classList.add('hidden');

    galleryCloseIcon.removeEventListener('click', onGalleryCloseClick);
    galleryCloseIcon.removeEventListener('keydown', onGalleryCloseEnterPress);
    document.removeEventListener('keydown', onGalleryCloseEscPress);
  };

  //  показ окна галереи
  var onAnyPictureClick = function (evt) {
    evt.preventDefault();
    var clickedItem = evt.target;
    var itemStats = clickedItem.nextElementSibling.children;

    //  делаем видимым окно галереи
    gallery.classList.remove('hidden');

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

  //  вешаем обработчик на каждую фотографию
  var addListenersToPictureList = function () {
    var images = document.querySelectorAll('img');
    for (var i = 0; i < document.querySelector('.pictures').children.length; i++) {
      images[i].addEventListener('click', onAnyPictureClick);
    }
  };
  addListenersToPictureList();

})();
