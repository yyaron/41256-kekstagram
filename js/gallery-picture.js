'use strict';
//  picture.js --- модуль для отрисовки миниатюры

(function () {
  //  сохраняем в переменную контейнер, куда будем записывать сгенерированные шаблоны
  var pictureList = document.querySelector('.pictures');
  //  хранит загруженные с сервера данные о картинках
  var downloadedPictures;

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
    var image = pictureElement.querySelector('img');
    var imageLink = pictureElement.querySelector('a');

    //  вставляем cгенерированную картинку из массива
    image.src = picture.url;
    //  вешаем обработчик клика на каждую фотографию
    image.addEventListener('click', window.onAnyPictureClick);
    //  вешаем обработчик нажатия Enter на каждую фотографию (ссылку фотографии)
    imageLink.addEventListener('keydown', window.onAnyPictureEnterPress);
    //  вставляем число лайков из массива
    pictureElement.querySelector('.picture-likes').textContent = picture.likes;
    //  вставляем число комментариев из массива
    pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;

    return pictureElement;
  };

  var renderPicturesOnPage = function (pictures) {
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

  var uncheckOtherFilterInputs = function (currentInput) {
    var filterInputs = document.querySelectorAll('input[name="filter"]');
    for (var i = 0; i < filterInputs.length; i++) {
      filterInputs[i].checked = false;
    }
    currentInput.checked = true;
  };

  var onLoadPictures = function (pictures) {
    downloadedPictures = pictures;
    renderPicturesOnPage(pictures);
  };

  //  загружаем картинки
  window.backend.download(onLoadPictures, window.showAlertMessage);

  //  фотографии в том порядке, в котором они были загружены с сервера
  var recommendedFilter = document.querySelector('#filter-recommend');

  var loadRecommendedPictures = function () {
    uncheckOtherFilterInputs(recommendedFilter);

    renderPicturesOnPage(downloadedPictures);
  };

  recommendedFilter.addEventListener('click', window.debounce(loadRecommendedPictures, 500));

  //  фотографии, отсортированные в порядке убывания количества лайков
  var popularFilter = document.querySelector('#filter-popular');

  var loadPopularPictures = function () {
    uncheckOtherFilterInputs(popularFilter);

    var popularPictures = downloadedPictures.slice(0);

    //  сортируем массив с лайками по убыванию
    popularPictures.sort(function (first, second) {
      if (first.likes > second.likes) {
        return -1;
      } else if (first.likes < second.likes) {
        return 1;
      } else {
        return 0;
      }
    });
    //  передаем отсортированный массив
    //  в функцию отрисовки фотографий на странице
    renderPicturesOnPage(popularPictures);
  };

  popularFilter.addEventListener('click', window.debounce(loadPopularPictures, 500));

  //  фотографии, отсортированные в порядке убывания количества комментариев
  var discussedFilter = document.querySelector('#filter-discussed');

  var loadDiscussedPictures = function () {
    uncheckOtherFilterInputs(discussedFilter);

    var discussedPictures = downloadedPictures.slice(0);

    //  сортируем массив с комментами по убыванию
    discussedPictures.sort(function (first, second) {
      if (first.comments.length > second.comments.length) {
        return -1;
      } else if (first.comments.length < second.comments.length) {
        return 1;
      } else {
        return 0;
      }
    });
    //  передаем отсортированный массив
    //  в функцию отрисовки фотографий на странице
    renderPicturesOnPage(discussedPictures);
  };

  discussedFilter.addEventListener('click', window.debounce(loadDiscussedPictures, 500));

  //  фотографии, отсортированные в случайном порядке
  var randomFilter = document.querySelector('#filter-random');

  var loadRandomPictures = function () {
    uncheckOtherFilterInputs(randomFilter);
    var randomPictures = downloadedPictures.slice(0);
    //  перемешиваем данные массива в случайном порядке
    var shuffleArray = function (array) {
      var currentIndex = array.length;
      var temporaryValue = currentIndex;
      var randomIndex = currentIndex;

      while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }
      return array;
    };
    //  передаем отсортированный массив
    //  в функцию отрисовки сетки фотографий на странице
    renderPicturesOnPage(shuffleArray(randomPictures));
  };

  randomFilter.addEventListener('click', window.debounce(loadRandomPictures, 500));

})();
