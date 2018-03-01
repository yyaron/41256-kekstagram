'use strict';

window.debounce = (function (func, wait, immediate) {
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
});
