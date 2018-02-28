'use strict';
//  picture.js --- модуль для отрисовки миниатюры

(function () {
  //  сохраняем в переменную контейнер, куда будем записывать сгенерированные шаблоны
  var pictureList = document.querySelector('.pictures');

  //  показываем фильтры
  var showFilters = function () {
    var filtersBar = document.querySelector('.filters');

    if (filtersBar.classList.contains('filters-inactive')) {
      filtersBar.classList.remove('filters-inactive');
    }
  };

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
    pictureList.innerHTML = '';
    pictureList.appendChild(fragment);

    showFilters();
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

  //  загружаем картинки
  window.download(loadPictures, window.showAlertMessage);

  var uncheckOtherFilterInputs = function (currentInput) {
    document.querySelectorAll('input[name="filter"]').checked = false;
    currentInput.checked = true;
  };

  //  фотографии в том порядке, в котором они были загружены с сервера
  var recommendedFilter = document.querySelector('#filter-recommend');

  var loadRecommendedPictures = function () {
    uncheckOtherFilterInputs(recommendedFilter);
    window.download(loadPictures, window.showAlertMessage);
  };

  recommendedFilter.addEventListener('click', loadRecommendedPictures);

  //  фотографии, отсортированные в порядке убывания количества лайков
  var popularFilter = document.querySelector('#filter-popular');

  var loadPopularPictures = function (pictures) {
    uncheckOtherFilterInputs(popularFilter);

    //  сортируем массив с лайками по убыванию
    var popularPictures = pictures.sort(function (first, second) {
      if (first.likes > second.likes) {
        return -1;
      } else if (first.likes < second.likes) {
        return 1;
      } else {
        return 0;
      }
    });

    //  передаем отсортированный массив
    //  в функцию отрисовки сетки фотографий на странице
    loadPictures(popularPictures);
  };

  popularFilter.addEventListener('click', function () {
    window.download(loadPopularPictures, window.showAlertMessage);
  });

})();
