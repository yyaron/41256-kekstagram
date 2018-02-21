'use strict';
//  preview.js --- модуль для отрисовки увеличенного изображения

(function () {

  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;

  //  поле загрузки фото, окно предпросмотра фото, кнопка закрытия окна
  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadFormClose = document.querySelector('.upload-form-cancel');

  //  функция закрытия окна превью по нажатии на Escape
  var onOverlayCloseEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      onUploadOverlayCloseClick();
    }
  };

  //  функция закрытия окна превью по нажатии на Enter
  var onOverlayCloseEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      onUploadOverlayCloseClick();
    }
  };

  //  функция открытия окна превью
  var onUploadFileChange = function () {
    uploadOverlay.classList.remove('hidden');

    //  закрываем по клику
    uploadFormClose.addEventListener('click', onUploadOverlayCloseClick);
    //  закрываем по нажатии на Escape
    document.addEventListener('keydown', onOverlayCloseEscPress);
    //  закрываем по нажатии на Enter, если крестик в фокусе
    uploadFormClose.addEventListener('keydown', onOverlayCloseEnterPress);
  };

  //  закрытие окна превью
  var onUploadOverlayCloseClick = function () {
    uploadOverlay.classList.add('hidden');
    uploadFile.value = '';

    //  удаляем обработчики по закрытию окна
    uploadFormClose.removeEventListener('click', onUploadOverlayCloseClick);
    document.removeEventListener('keydown', onOverlayCloseEscPress);
    uploadFormClose.removeEventListener('keydown', onOverlayCloseEnterPress);
  };

  //  показываем окно превью по изменению значения
  uploadFile.addEventListener('change', onUploadFileChange);

  //  окно галереи, кнопка закрытия окна
  var gallery = document.querySelector('.gallery-overlay');
  var galleryCloseIcon = gallery.querySelector('.gallery-overlay-close');

  //  закрытие окна галереи по нажатии на Enter
  var onGalleryCloseEnterPress = function (evt) {
    if (evt.keyCode === ENTER_KEYCODE) {
      onGalleryCloseClick();
    }
  };

  //  закрытие окна галереи по нажатии на Escape
  var onGalleryCloseEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
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
