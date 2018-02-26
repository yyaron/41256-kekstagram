'use strict';
//  backend.js экспортирует в глобальную область видимости функции
//  для взаимодействия с удалённым севером через XHR

  //  загрузка данных с сервера
  window.download = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('GET', 'https://js.dump.academy/kekstagram/data');
    xhr.send();
  };

  //  отправка формы превью
  window.upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === 200) {
        onLoad(xhr.response);
      } else {
        onError('Cтатус ответа: ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.open('POST', 'https://js.dump.academy/kekstagram');
    xhr.send(data);
  };

