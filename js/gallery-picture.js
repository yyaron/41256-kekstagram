'use strict';
//  picture.js --- модуль для отрисовки миниатюры

(function () {
  //  сохраняем в переменную контейнер, куда будем записывать сгенерированные шаблоны
  var pictureList = document.querySelector('.pictures');

  var renderImage = function (picture) {
    //  сохраняем в переменную шаблон
    var pictureTemplate = document.querySelector('#picture-template').content;
    //  копируем всё содержимое шаблона в новый элемент
    var pictureElement = pictureTemplate.cloneNode(true);
    //  вставляем cгенерированную картинку из массива
    pictureElement.querySelector('img').src = picture.url;
    //  вешаем обработчик на каждую фотографию
    pictureElement.querySelector('img').addEventListener('click', window.onAnyPictureClick);
    //  вставляем рандомное число лайков из массива
    pictureElement.querySelector('.picture-likes').textContent = picture.likes;
    //  вставляем рандомное число комментариев из массива
    pictureElement.querySelector('.picture-comments').textContent = window.data.getCommentsNumber(picture.comments);

    return pictureElement;
  };

  var loadPictures = function (pictures) {
    //  создаем фрагмент
    var fragment = document.createDocumentFragment();
    //  и воспроизводим шаблоны с помощью фрагмента
    for (var j = 0; j < pictures.length; j++) {
      fragment.appendChild(renderImage(pictures[j]));
    }
    pictureList.appendChild(fragment);
  };

  window.showAlertMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      node.parentNode.removeChild(node);
    }, 3000);
  };

  window.download(loadPictures, window.showAlertMessage);

})();
