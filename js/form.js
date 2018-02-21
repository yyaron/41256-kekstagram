'use strict';
//  form.js --- модуль, который работает с формой редактирования изображения

(function () {
  //  кнопка увеличения, кнопка уменьшения, индикатор масштаба, фото
  var increaseButton = document.querySelector('.upload-resize-controls-button-inc');
  var decreaseButton = document.querySelector('.upload-resize-controls-button-dec');
  var sizeValue = document.querySelector('.upload-resize-controls-value');
  var imagePreview = document.querySelector('.effect-image-preview');

  //  вынес в отдельныную функцию повторяющийся блок для onIncreaseButtonClick и onDecreaseButtonClick
  var calculateScale = function () {
    imagePreview.style.transform = 'scale(' + (sizeValue.value / 100) + ')';
    sizeValue.value += '%';
  };

  //  увеличение масштаба фото
  var onIncreaseButtonClick = function () {
    if (parseInt(sizeValue.value, 10) < 100) {
      sizeValue.value = parseInt(sizeValue.value, 10) + 25;
      calculateScale();
    }
  };

  //  уменьшение масштаба фото
  var onDecreaseButtonClick = function () {
    if (parseInt(sizeValue.value, 10) > 25) {
      sizeValue.value = parseInt(sizeValue.value, 10) - 25;
      calculateScale();
    }
  };

  //  обработчик нажатия на кнопку увеличения
  increaseButton.addEventListener('click', onIncreaseButtonClick);
  //  обработчик нажатия на кнопку увеличения
  decreaseButton.addEventListener('click', onDecreaseButtonClick);

  //  слайдер, ползунок, значение ползунка
  var uploadEffectControls = window.uploadOverlay.querySelector('.upload-effect-level');
  var sliderPin = window.uploadOverlay.querySelector('.upload-effect-level-pin');
  var effectLevel = window.uploadOverlay.querySelector('.upload-effect-level-value');

  var currentAppliedFilterFunction;

  //  флаг
  var sliderPinIsDragged = false;

  //  обработчик взаимодействия с ползунком
  var onPinPositionSliderMouseup = function (evt) {
    var windowWidth = window.innerWidth;
    var sliderWidth = document.querySelector('.upload-effect-level-line').clientWidth;
    var pinPosition = evt.clientX;

    //  определяем положение ползунка на слайдере
    var pinPositionOnSlider = pinPosition - ((windowWidth - sliderWidth) / 2);

    sliderPinIsDragged = true;
    //  определяем пропорцию эффекта относительно положения ползунка
    effectLevel.value = (pinPositionOnSlider / sliderWidth).toFixed(2);
    filterFunctions[currentAppliedFilterFunction]();
  };

  // проверяет состояние ползунка и при необходимости сбрасывает значение фильтра
  var checkSliderPinStatus = function () {
    if (!sliderPinIsDragged) {
      effectLevel.value = 1;
    }
  };

  //  обработчик на ползунке мыши
  sliderPin.addEventListener('mouseup', onPinPositionSliderMouseup);

  //  создаем коллекцию кнопок, которые переключают эффекты
  var uploadEffectPreviewButtons = document.querySelectorAll('.upload-effect-preview');

  //  присваиваем этим кнопкам читабельные названия
  var effectNoneButton = uploadEffectPreviewButtons[0];
  var effectChromeButton = uploadEffectPreviewButtons[1];
  var effectSepiaButton = uploadEffectPreviewButtons[2];
  var effectMarvinButton = uploadEffectPreviewButtons[3];
  var effectFobosButton = uploadEffectPreviewButtons[4];
  var effectHeatButton = uploadEffectPreviewButtons[5];

  //  прячем слайдер по умолчанию
  var hideUploadEffectControls = function () {
    uploadEffectControls.classList.add('hidden');

  };
  hideUploadEffectControls();

  //  показываем слайдер
  var showUploadEffectControls = function () {
    uploadEffectControls.classList.remove('hidden');
  };

  //  объект с фильтрами
  var filterFunctions = {
    //  сбрасывает остальные эффекты
    clearLastEffect: function () {
      imagePreview.classList.remove('upload-effect-chrome', 'upload-effect-sepia', 'upload-effect-marvin', 'upload-effect-fobos', 'upload-effect-heat');
    },

    //  переключает на оригинал
    onEffectNoneButtonClick: function () {
      filterFunctions.clearLastEffect();
      hideUploadEffectControls();
      checkSliderPinStatus();

      sliderPinIsDragged = false;
      currentAppliedFilterFunction = 'onEffectNoneButtonClick';
      imagePreview.style.filter = '';
    },

    //  переключает на "хром"
    onEffectChromeButtonClick: function () {
      filterFunctions.clearLastEffect();
      showUploadEffectControls();
      checkSliderPinStatus();

      sliderPinIsDragged = false;
      currentAppliedFilterFunction = 'onEffectChromeButtonClick';
      imagePreview.classList.add('upload-effect-chrome');
      document.querySelector('.upload-effect-chrome').style.filter = 'grayscale(' + effectLevel.value + ')';
    },

    //  переключает на "сепию"
    onEffectSepiaButtonClick: function () {
      filterFunctions.clearLastEffect();
      showUploadEffectControls();
      checkSliderPinStatus();

      sliderPinIsDragged = false;
      currentAppliedFilterFunction = 'onEffectSepiaButtonClick';
      imagePreview.classList.add('upload-effect-sepia');
      document.querySelector('.upload-effect-sepia').style.filter = 'sepia(' + effectLevel.value + ')';
    },

    //  переключает на "марвин"
    onEffectMarvinButtonClick: function () {
      filterFunctions.clearLastEffect();
      showUploadEffectControls();
      checkSliderPinStatus();

      sliderPinIsDragged = false;
      currentAppliedFilterFunction = 'onEffectMarvinButtonClick';
      imagePreview.classList.add('upload-effect-marvin');
      document.querySelector('.upload-effect-marvin').style.filter = 'invert(' + ((effectLevel.value * 10) + '%') + ')';
    },

    //  переключает на "фобос"
    onEffectFobosButtonClick: function () {
      filterFunctions.clearLastEffect();
      showUploadEffectControls();
      checkSliderPinStatus();

      sliderPinIsDragged = false;
      currentAppliedFilterFunction = 'onEffectFobosButtonClick';
      imagePreview.classList.add('upload-effect-fobos');
      document.querySelector('.upload-effect-fobos').style.filter = 'blur(' + ((effectLevel.value * 3) + 'px') + ')';
    },

    //  переключает на "зной"
    onEffectHeatButtonClick: function () {
      filterFunctions.clearLastEffect();
      showUploadEffectControls();
      checkSliderPinStatus();

      sliderPinIsDragged = false;
      currentAppliedFilterFunction = 'onEffectHeatButtonClick';
      imagePreview.classList.add('upload-effect-heat');
      document.querySelector('.upload-effect-heat').style.filter = 'brightness(' + (effectLevel.value * 3) + ')';
    }
  };

  //  добавляем обработчики на кнопки
  effectNoneButton.addEventListener('click', filterFunctions.onEffectNoneButtonClick);
  effectChromeButton.addEventListener('click', filterFunctions.onEffectChromeButtonClick);
  effectSepiaButton.addEventListener('click', filterFunctions.onEffectSepiaButtonClick);
  effectMarvinButton.addEventListener('click', filterFunctions.onEffectMarvinButtonClick);
  effectFobosButton.addEventListener('click', filterFunctions.onEffectFobosButtonClick);
  effectHeatButton.addEventListener('click', filterFunctions.onEffectHeatButtonClick);

  //  проверяем двойные пробелы
  var checkDoubledSpaces = function (hashtags, input) {
    for (var i = 0, len = hashtags.length; i < len; i++) {
      var hashtag = hashtags[i];

      if (hashtag === '') {
        input.setCustomValidity('Хештеги разделены больше чем одним пробелом после ' + i + '-го хештега.');
        break;
      } else {
        input.setCustomValidity('');
      }
    }
  };

  //  проверяем повторяющиеся хэштеги
  var checkDuplicates = function (hashtags, input) {
    var lowerCaseItems = hashtags.map(function (item) {
      return item.toLowerCase();
    });

    for (var i = 0, len = hashtags.length; i < len; i++) {
      var hashtag = hashtags[i];
      var hastagIndex = lowerCaseItems.indexOf(hashtag.toLowerCase());

      if (hastagIndex !== i) {
        input.setCustomValidity('Хештеги ' + hashtags[hastagIndex] + ' и ' + hashtags[i] + ' повторяются.');
        break;
      } else {
        input.setCustomValidity('');
      }
    }
  };

  //  поле ввода хэштегов
  var uploadFormHashtagField = window.uploadOverlay.querySelector('.upload-form-hashtags');
  var hashtags = [];

  uploadFormHashtagField.addEventListener('input', function (evt) {
    var target = evt.target;
    //  проверка наличия решетки в начале, проверка наличия пробела после хэштега
    var pattern = /[#].*/;
    //  получаем строку введенных хэштегов и превращаем ее в массив
    hashtags = target.value.split(' ');

    //  если возникла ошибка 2+ пробела выходим с функции, тк validationMessage уже установлен
    checkDoubledSpaces(hashtags, target);
    if (target.validationMessage !== '') {
      return;
    }
    //  если возникла ошибка с дубликатами выходим с функции, тк validationMessage уже установлен
    checkDuplicates(hashtags, target);
    if (target.validationMessage !== '') {
      return;
    }
    if (hashtags.length > 5) {
      target.setCustomValidity('Не больше 5 хэштегов.');
      return;
    }

    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i].length < 3) {
        target.setCustomValidity('Минимальная длина хэштега - 3 знака. В строке не должно быть лишних пробелов.');
        break;
      } else if (hashtags[i].length > 20) {
        target.setCustomValidity('Максимальная длина хэштега - 20 знаков.');
        break;
      } else if (!pattern.test(hashtags[i])) {
        debugger;
        target.setCustomValidity('Хэштег должен начинаться с решетки.');
        break;
      } else if (hashtags[i].indexOf(',') !== -1 || hashtags[i].indexOf(';') !== -1) {
        debugger;
        target.setCustomValidity('Хэштеги нужно отделять пробелами.');
        break;
      } else {
        target.setCustomValidity('');
      }
    }
  });

  var form = document.querySelector('#upload-select-image');
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
  });

})();
