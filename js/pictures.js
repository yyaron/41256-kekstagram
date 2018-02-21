'use strict';

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

//  получаем случайное число от 15 до 200. на всякий случай мин. и макс. количество лайков записаны в константы
var getRandomLikeNumber = function () {
  return Math.floor(Math.random() * (LIKES_MAX + 1 - LIKES_MIN) + LIKES_MIN);
};

//  получаем случайное количество комментариев. минимальное и максимальное значение привязаны к величине массива COMMENTS.
//  в перспективе можно использовать эту функцию для получения случайного комментария.
var getCommentsNumber = function (arr) {
  var commentsNumber = Math.round(Math.random() * arr.length);
  return commentsNumber;
};

//  функция, которая генерирует массив с объектами. внутри объектов содержатся случайные значения
var getFriendPictures = function () {
  //  массив, в котором содержатся объекты, описывающие параметры фотографий
  var friendPictures = [];
  //  цикл, который добавляет в массив необходимое количество объектов
  for (var i = 0; i < 26; i++) {
    friendPictures[i] =
    {
      url: 'photos/' + [i + 1] + '.jpg',
      likes: getRandomLikeNumber(),
      comments: getCommentsNumber(COMMENTS),
    };
  }
  return friendPictures;
};
var friendPictures = getFriendPictures();

//  сохраняем в переменную контейнер, куда будем записывать сгенерированные шаблоны
var pictureList = document.querySelector('.pictures');

var renderImage = function (picture) {
  //  сохраняем в переменную шаблон
  var pictureTemplate = document.querySelector('#picture-template').content;
  //  копируем всё содержимое шаблона в новый элемент
  var pictureElement = pictureTemplate.cloneNode(true);
  //  вставляем cгенерированную картинку из массива
  pictureElement.querySelector('img').src = picture.url;
  //  вставляем рандомное число лайков из массива
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  //  вставляем рандомное число комментариев из массива
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  return pictureElement;
};

//  создаем фрагмент
var fragment = document.createDocumentFragment();

//  и воспроизводим шаблоны с помощью фрагмента
for (var j = 0; j < friendPictures.length; j++) {
  fragment.appendChild(renderImage(friendPictures[j]));
}
pictureList.appendChild(fragment);

//  //////////////////  //
//  ////// #13 ///////  //
//  //////////////////  //

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
  var images = pictureList.querySelectorAll('img');
  for (var i = 0; i < pictureList.children.length; i++) {
    images[i].addEventListener('click', onAnyPictureClick);
  }
};
addListenersToPictureList();

//  кнопка увеличения, кнопка уменьшения, индикатор масштаба, фото
var increaseButton = document.querySelector('.upload-resize-controls-button-inc');
var decreaseButton = document.querySelector('.upload-resize-controls-button-dec');
var sizeValue = document.querySelector('.upload-resize-controls-value');
var imagePreview = document.querySelector('.effect-image-preview');

//  вынес в отдельныную функцию повторяющийся блок для onIncreaseButtonClick и onDecreaseButtonClick
var calculateScale = function () {
  imagePreview.style.transform = 'scale(' + (sizeValue.value / 100) + ')';
  sizeValue.value += '%';
};

//  увеличение масштаба фото
var onIncreaseButtonClick = function () {
  if (parseInt(sizeValue.value, 10) < 100) {
    sizeValue.value = parseInt(sizeValue.value, 10) + 25;
    calculateScale();
  }
};

//  уменьшение масштаба фото
var onDecreaseButtonClick = function () {
  if (parseInt(sizeValue.value, 10) > 25) {
    sizeValue.value = parseInt(sizeValue.value, 10) - 25;
    calculateScale();
  }
};

//  обработчик нажатия на кнопку увеличения
increaseButton.addEventListener('click', onIncreaseButtonClick);
//  обработчик нажатия на кнопку увеличения
decreaseButton.addEventListener('click', onDecreaseButtonClick);

//  слайдер, ползунок, значение ползунка
var uploadEffectControls = uploadOverlay.querySelector('.upload-effect-level');
var sliderPin = uploadOverlay.querySelector('.upload-effect-level-pin');
var effectLevel = uploadOverlay.querySelector('.upload-effect-level-value');

var currentAppliedFilterFunction;

//  обработчик взаимодействия с ползунком
var onPinPositionSliderMouseup = function (evt) {
  var windowWidth = window.innerWidth;
  var sliderWidth = document.querySelector('.upload-effect-level-line').clientWidth;
  var pinPosition = evt.clientX;

  //  определяем положение ползунка на слайдере
  var pinPositionOnSlider = pinPosition - ((windowWidth - sliderWidth) / 2);

  //  определяем пропорцию эффекта относительно положения ползунка
  effectLevel.value = (pinPositionOnSlider / sliderWidth).toFixed(2);
  filterFunctions[currentAppliedFilterFunction]();
};

//  обработчик на ползунке мыши
sliderPin.addEventListener('mouseup', onPinPositionSliderMouseup);

//  создаем коллекцию кнопок, которые переключают эффекты
var uploadEffectPreviewButtons = document.querySelectorAll('.upload-effect-preview');

//  присваиваем этим кнопкам читабельные названия
var effectNoneButton = uploadEffectPreviewButtons[0];
var effectChromeButton = uploadEffectPreviewButtons[1];
var effectSepiaButton = uploadEffectPreviewButtons[2];
var effectMarvinButton = uploadEffectPreviewButtons[3];
var effectFobosButton = uploadEffectPreviewButtons[4];
var effectHeatButton = uploadEffectPreviewButtons[5];

//  прячем слайдер по умолчанию
var hideUploadEffectControls = function () {
  uploadEffectControls.classList.add('hidden');
  effectLevel.value = 1;
};
hideUploadEffectControls();

//  показываем слайдер
var showUploadEffectControls = function () {
  uploadEffectControls.classList.remove('hidden');
};


var clearLastEffect = function () {
  imagePreview.classList.remove('upload-effect-chrome', 'upload-effect-sepia', 'upload-effect-marvin', 'upload-effect-fobos', 'upload-effect-heat');
};

var filterFunctions = {
  //  переключает на оригинал (сбрасывает остальные эффекты)
  onEffectNoneButtonClick: function () {
    clearLastEffect();
    hideUploadEffectControls();

    currentAppliedFilterFunction = 'onEffectNoneButtonClick';
    imagePreview.style.filter = '';
  },

  //  переключает на "хром"
  onEffectChromeButtonClick: function () {
    clearLastEffect();
    showUploadEffectControls();

    currentAppliedFilterFunction = 'onEffectChromeButtonClick';
    imagePreview.classList.add('upload-effect-chrome');
    document.querySelector('.upload-effect-chrome').style.filter = 'grayscale(' + effectLevel.value + ')';
  },

  //  переключает на "сепию"
  onEffectSepiaButtonClick: function () {
    clearLastEffect();
    showUploadEffectControls();

    currentAppliedFilterFunction = 'onEffectSepiaButtonClick';
    imagePreview.classList.add('upload-effect-sepia');
    document.querySelector('.upload-effect-sepia').style.filter = 'sepia(' + effectLevel.value + ')';
  },

  //  переключает на "марвин"
  onEffectMarvinButtonClick: function () {
    clearLastEffect();
    showUploadEffectControls();

    currentAppliedFilterFunction = 'onEffectMarvinButtonClick';
    imagePreview.classList.add('upload-effect-marvin');
    document.querySelector('.upload-effect-marvin').style.filter = 'invert(' + ((effectLevel.value * 10) + '%') + ')';
  },

  //  переключает на "фобос"
  onEffectFobosButtonClick: function () {
    clearLastEffect();
    showUploadEffectControls();

    currentAppliedFilterFunction = 'onEffectFobosButtonClick';
    imagePreview.classList.add('upload-effect-fobos');
    document.querySelector('.upload-effect-fobos').style.filter = 'blur(' + ((effectLevel.value * 3) + 'px') + ')';
  },

  //  переключает на "зной"
  onEffectHeatButtonClick: function () {
    clearLastEffect();
    showUploadEffectControls();

    currentAppliedFilterFunction = 'onEffectHeatButtonClick';
    imagePreview.classList.add('upload-effect-heat');
    document.querySelector('.upload-effect-heat').style.filter = 'brightness(' + (effectLevel.value * 3) + ')';
  }
};

//  добавляем обработчики на кнопки
effectNoneButton.addEventListener('click', filterFunctions.onEffectNoneButtonClick);
effectChromeButton.addEventListener('click', filterFunctions.onEffectChromeButtonClick);
effectSepiaButton.addEventListener('click', filterFunctions.onEffectSepiaButtonClick);
effectMarvinButton.addEventListener('click', filterFunctions.onEffectMarvinButtonClick);
effectFobosButton.addEventListener('click', filterFunctions.onEffectFobosButtonClick);
effectHeatButton.addEventListener('click', filterFunctions.onEffectHeatButtonClick);

//  форма загрузки фото, поле ввода хэштегоы
var uploadForm = document.querySelector('.upload-form')
var uploadFormHashtagField = uploadOverlay.querySelector('.upload-form-hashtags');

uploadFormHashtagField.addEventListener('input', function (evt) {
  var target = evt.target;
  //  получаем строку введенных хэштегов и превращаем ее в массив
  var hashtags = target.value.split(' ');
  //  проверка наличия решетки в начале, проверка наличия пробела после хэштега
  var pattern1 = /[#].*/;
  var pattern2 = /[#].*[ ]/;

  for (var i = 0; i < hashtags.length; i++) {
    if (hashtags.length > 5) {
      target.setCustomValidity('Не больше 5 хэштегов.');
    } else if (hashtags[i].length < 3) {
      target.setCustomValidity('Минимальная длина хэштега - 3 знака. В строке не должно быть лишних пробелов.');
    } else if (hashtags[i].length > 20) {
      target.setCustomValidity('Макстмальная длина хэштега - 20 знаков.');
    } else if (!pattern1.test(hashtags[i])) {
      target.setCustomValidity('Хэштег должен начинаться с решетки.');
    } else if (!pattern2.test(hashtags[i])) {
      target.setCustomValidity('Хэштеги отделяются пробелами.');
      //  убираем это сообщение для последнего элемента на случай,
      //  если в конце строки будет висячий пробел
      if (hashtags[i] === hashtags[hashtags.length - 1]) {
        target.setCustomValidity('')
      }
    } else {
    target.setCustomValidity('');
    }
  }
});

//  var pattern = /[#][a-zA-Zа-яёєїА-ЯЁЄЇ0-9]{3,20}/;
