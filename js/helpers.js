'use strict';
//  helpers.js --- модуль, который хранит вспомогательные элементы

(function () {
  //  константы кнопок
  window.keys = {
    ESC_KEYCODE: 27,
    ENTER_KEYCODE: 13
  };

  //  алёрт при ошибке отправки или загрузки данных
  window.showAlertMessage = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error-message');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      node.parentNode.removeChild(node);
    }, 3000);
  };

  //  дебаунсер, устраняет дребез при переключении фильтров
  window.debounce = function (func, wait, immediate) {
    var timeout;
    return function () {
      var context;
      var args = arguments;

      var later = function () {
        timeout = null;
        if (!immediate) {
          func.apply(context, args);
        }
      };

      var callNow = immediate && !timeout;
      clearTimeout(timeout);

      timeout = setTimeout(later, wait);
      if (callNow) {
        func.apply(context, args);
      }
    };
  };

  window.previewFile = function () {
    var preview = document.querySelector('img.effect-image-preview');
    var file = document.querySelector('input[type=file]').files[0];
    var reader = new FileReader();

    reader.onloadend = function () {
      preview.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

})();
