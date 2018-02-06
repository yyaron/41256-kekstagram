'use strict';

var LIKES_MIN = 15;
var LIKES_MAX = 200;
var COMMENTS = [
'Всё отлично!',
"В целом всё неплохо. Но не всё.",
'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

//  получаем случайное число от 15 до 200. на всякий случай мин. и макс. количество лайков записаны в константы
var getRandomLikeNumber = function () {
  LIKES_MAX += 1;
  var randomLikeNumber = Math.floor(Math.random() * (LIKES_MAX - LIKES_MIN) + LIKES_MIN);
  return randomLikeNumber;
};

//  получаем случайное количество комментариев. минимальное и максимальное значение привязаны к величине массива COMMENTS.
//  в перспективе можно использовать эту функцию для получения случайного комментария.
var getCommentsNumber = function (arr) {
  var max = arr.length;
  var commentsNumber = Math.round(Math.random() * (max - 1));
  return commentsNumber;
};

//  функция, которая генерирует массив с объектами. внутри объектов содержатся случайные значения
var getFriendPictures = function () {
  //  массив, в котором содержатся объекты, описывающие параметры фотографий
  var friendPictures = [];
  //  цикл, который добавляет в массив необходимое количество объектов
  for (var i = 1; i <= 26; i++) {
    friendPictures[i - 1] =
    {
      url: 'photos/' + [i] + '.jpg',
      likes: getRandomLikeNumber(),
      comments: getCommentsNumber(COMMENTS),
    };
  }
  return friendPictures;
};
var friendPictures = getFriendPictures();

//  сохраняем в переменную шаблон
var pictureTemplate = document.querySelector('#picture-template').content;
//  сохраняем в переменную контейнер, куда будем записывать сгенерированные шаблоны
var pictureList = document.querySelector('.pictures');

var renderImage = function (picture) {
  //  копируем всё содержимое шаблона в новый элемент
  var pictureElement = pictureTemplate.cloneNode(true);
  //  вставляем мгенерированную картинку из массива
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

//  делаем видимым окно галереи
var gallery = document.querySelector('.gallery-overlay');
gallery.classList.remove('hidden');
