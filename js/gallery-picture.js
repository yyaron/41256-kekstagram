'use strict';
//  picture.js --- модуль для отрисовки миниатюры

(function () {
  var DEBOUNCE_TIME = 500;

  //  сохраняем в переменную контейнер, куда будем записывать сгенерированные шаблоны
  var pictureList = document.querySelector('.pictures');
  //  хранит загруженные с сервера данные о картинках
  var downloadedPictures;
  //  лейблы инпутов с фильтрами
  var recommendedFilterLabel = document.querySelectorAll('.filters-item')[0];
  var popularFilterLabel = document.querySelectorAll('.filters-item')[1];
  var discussedFilterLabel = document.querySelectorAll('.filters-item')[2];
  var randomFilterLabel = document.querySelectorAll('.filters-item')[3];

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
    image.addEventListener('click', window.galleryPreview.onAnyPictureClick);
    //  вешаем обработчик нажатия Enter на каждую фотографию (ссылку фотографии)
    imageLink.addEventListener('keydown', window.galleryPreview.onAnyPictureEnterPress);
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
  window.backend.download(onLoadPictures, window.helpers.showAlertMessage);

  //  фотографии в том порядке, в котором они были загружены с сервера
  var recommendedFilter = document.querySelector('#filter-recommend');

  var loadRecommendedPictures = function () {
    uncheckOtherFilterInputs(recommendedFilter);

    renderPicturesOnPage(downloadedPictures);
  };

  var onAnyFilterEnterPress = function (evt) {
    if (evt.keyCode === window.helpers.keys.ENTER_KEYCODE) {
      evt.target.control.click();
    }
  };

  //  обработчик по клику на фильтр
  recommendedFilter.addEventListener('click', window.helpers.debounce(loadRecommendedPictures, DEBOUNCE_TIME));
  //  обработчик по нажатию Enter
  recommendedFilterLabel.addEventListener('keydown', onAnyFilterEnterPress);

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
      }
      return 0;
    });
    //  передаем отсортированный массив
    //  в функцию отрисовки фотографий на странице
    renderPicturesOnPage(popularPictures);
  };

  //  обработчик по клику на фильтр
  popularFilter.addEventListener('click', window.helpers.debounce(loadPopularPictures, DEBOUNCE_TIME));
  //  обработчик по нажатию Enter
  popularFilterLabel.addEventListener('keydown', onAnyFilterEnterPress);

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
      }
      return 0;
    });
    //  передаем отсортированный массив
    //  в функцию отрисовки фотографий на странице
    renderPicturesOnPage(discussedPictures);
  };

  //  обработчик по клику на фильтр
  discussedFilter.addEventListener('click', window.helpers.debounce(loadDiscussedPictures, DEBOUNCE_TIME));
  //  обработчик по нажатию Enter
  discussedFilterLabel.addEventListener('keydown', onAnyFilterEnterPress);

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

  //  обработчик по клику на фильтр
  randomFilter.addEventListener('click', window.helpers.debounce(loadRandomPictures, DEBOUNCE_TIME));
  //  обработчик по нажатию Enter
  randomFilterLabel.addEventListener('keydown', onAnyFilterEnterPress);

})();
