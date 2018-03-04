'use strict';
//  backend.js экспортирует в глобальную область видимости функции
//  для взаимодействия с удалённым севером через XHR

(function () {
  var SUCCESS_STATUS = 200;
  var REQUEST_TIMEOUT = 10000;

  //  обработчик загрузки/отправки данных
  var onXhrLoad = function (xhr, onLoad, onError) {
    xhr.addEventListener('load', function () {
      if (xhr.status === SUCCESS_STATUS) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });
  };

  //  обработчик ошибок
  var onXhrError = function (xhr, onError) {
    xhr.addEventListener('error', function () {
      onError('Ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });
    xhr.timeout = REQUEST_TIMEOUT;
  };

  window.backend = {
    //  отправка формы превью
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      onXhrLoad(xhr, onLoad, onError);
      onXhrError(xhr, onError);

      xhr.open('POST', 'https://js.dump.academy/kekstagram');
      xhr.send(data);
    },
    //  загрузка данных с сервера
    download: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      onXhrLoad(xhr, onLoad, onError);
      onXhrError(xhr, onError);

      xhr.open('GET', 'https://js.dump.academy/kekstagram/data');
      xhr.send();
    }
  };

})();
