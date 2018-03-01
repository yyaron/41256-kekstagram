'use strict';
//  keys.js --- модуль, который хранит

window.keys = {
  ESC_KEYCODE: 27,
  ENTER_KEYCODE: 13
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
