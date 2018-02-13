'use strict';

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
var uploadForm = document.querySelector('#upload-file');
var uploadOverlay = document.querySelector('.upload-overlay');
var uploadFormClose = document.querySelector('.upload-form-cancel');

//  var uploadOverlayOpen = function () {
//    uploadOverlay.classList.remove('hidden');
//  };

//  var uploadOverlayClose = function () {
//    uploadOverlay.classList.add('hidden');
//  uploadForm.value = '';
//  };

//  показываем окно превью по изменению значения
uploadForm.addEventListener('change', function () {
  uploadOverlay.classList.remove('hidden');

  //  закрываем по клику
  uploadFormClose.addEventListener('click', function () {
    uploadOverlay.classList.add('hidden');
    uploadForm.value = '';
  });

  //  закрываем по нажатии на Escape
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
      uploadOverlay.classList.add('hidden');
      uploadForm.value = '';
    }
  });

  //  закрываем по нажатии на Enter, если крестик в фокусе
  uploadFormClose.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 13) {
      uploadOverlay.classList.add('hidden');
      uploadForm.value = '';
    }
  });
});


//  окно галереи, кнопка закрытия окна
var gallery = document.querySelector('.gallery-overlay');
var galleryClose = gallery.querySelector('.gallery-overlay-close')

//  открываем окно по клику на фотографию
document.addEventListener('click', function (evt) {
  if (evt.target.tagName === 'IMG') {
    evt.preventDefault();
    var clickedItem = evt.target;
    var itemStats = clickedItem.nextElementSibling.children;

    //  делаем видимым окно галереи
    gallery.classList.remove('hidden');

    //  заполняем окно данными с выбранной фотографии
    gallery.querySelector('.gallery-overlay-image').src = clickedItem.src;
    gallery.querySelector('.likes-count').textContent = itemStats[0].textContent;
    gallery.querySelector('.comments-count').textContent = itemStats[1].textContent;
  }

  //  закрываем по клику на крестик
  galleryClose.addEventListener('click', function () {
    gallery.classList.add('hidden');
  });
  //  закрываем по клику на Enter, если крестик в фокусе
  galleryClose.addEventListener('keydown', function (evt) {
      if (evt.keyCode === 13) {
        gallery.classList.add('hidden');
      }
    });
  //  закрываем по клику на Escape
  document.addEventListener('keydown', function (evt) {
    if (evt.keyCode === 27) {
      gallery.classList.add('hidden');
    }
  });
});

//  кнопка увеличения, кнопка уменьшения, индикатор масштаба, фото
var increaseButton = document.querySelector('.upload-resize-controls-button-inc');
var decreaseButton = document.querySelector('.upload-resize-controls-button-dec');
var sizeValue = document.querySelector('.upload-resize-controls-value');
var imagePreview = document.querySelector('.effect-image-preview');

//  функция увеличения масштаба фото
var onIncreaseButtonClick = function () {
  if ((parseInt(sizeValue.value)) < 100) {
    sizeValue.value = (parseInt(sizeValue.value)) + 25;
    imagePreview.style.transform = 'scale(' + (sizeValue.value / 100) + ')';
    sizeValue.value += '%';
  }
};

//  функция уменьшения масштаба фото
var onDecreaseButtonClick = function () {
  if ((parseInt(sizeValue.value)) > 25) {
    sizeValue.value = (parseInt(sizeValue.value)) - 25;
    imagePreview.style.transform = 'scale(' + (sizeValue.value / 100) + ')';
    sizeValue.value += '%';
  }
};

//  обработчик нажатия на кнопку увеличения
increaseButton.addEventListener('click', onIncreaseButtonClick);
//  обработчик нажатия на кнопку увеличения
decreaseButton.addEventListener('click', onDecreaseButtonClick);

//  ползунок слайдера
var sliderPin = document.querySelector('.upload-effect-level-pin');

//  обработчик взаимодействия с ползунком
sliderPin.addEventListener('mouseup', function (evt) {
  var windowWidth = window.innerWidth;
  var sliderWidth = document.querySelector('.upload-effect-level-line').clientWidth;
  var pinPosition = evt.clientX;

  //  определяем положение ползунка на слайдере
  var pinPositionOnSlider = pinPosition - ((windowWidth - sliderWidth) / 2);
  //  определяем пропорцию эффекта относительно положения ползунка
  var proportion = (pinPositionOnSlider / sliderWidth).toFixed(2);

  console.log(proportion);
});
