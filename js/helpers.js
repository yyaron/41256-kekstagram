'use strict';
//  helpers.js --- модуль, который хранит вспомогательные элементы

(function () {

  var ERROR_SHOW_TIME = 5000;

  window.helpers = {
    //  константы кнопок
    keys: {
      ESC_KEYCODE: 27,
      ENTER_KEYCODE: 13
    },

    //  алёрт при ошибке отправки или загрузки данных
    showAlertMessage: function (errorMessage) {
      var node = document.createElement('div');
      node.classList.add('error-message');
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);

      setTimeout(function () {
        node.parentNode.removeChild(node);
      }, ERROR_SHOW_TIME);
    },

    //  дебаунсер, устраняет дребез при переключении фильтров
    debounce: function (func, wait, immediate) {
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
    },

    // загрузка, предпросмотр и редактирование собственного фото
    previewFile: function () {
      var preview = document.querySelector('img.effect-image-preview');
      var file = document.querySelector('input[type=file]').files[0];
      var reader = new FileReader();

      reader.onloadend = function () {
        preview.src = reader.result;
      };

      if (file) {
        reader.readAsDataURL(file);
      }
    }
  };

})();
