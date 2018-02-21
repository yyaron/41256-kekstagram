'use strict';
//  picture.js --- модуль для отрисовки миниатюры

(function () {
  //  функция, которая генерирует массив с объектами. внутри объектов содержатся случайные значения
  var getFriendPictures = function () {
    //  массив, в котором содержатся объекты, описывающие параметры фотографий
    var friendPictures = [];
    //  цикл, который добавляет в массив необходимое количество объектов
    for (var i = 0; i < 26; i++) {
      friendPictures[i] =
      {
        url: 'photos/' + [i + 1] + '.jpg',
        likes: window.data.getRandomLikeNumber(),
        comments: window.data.getCommentsNumber(window.COMMENTS),
      };
    }
    return friendPictures;
  };
  var friendPictures = getFriendPictures();

  //  сохраняем в переменную контейнер, куда будем записывать сгенерированные шаблоны
  window.pictureList = document.querySelector('.pictures');

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

})();
