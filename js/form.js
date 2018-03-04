'use strict';
//  form.js --- модуль, который работает с формой редактирования изображения

(function () {
  var MIN_SCALE = 25;
  var MAX_SCALE = 100;
  var SCALE_STEP = 25;
  var MIN_LEFT_POSITION = 0;

  var MIN_HASHTAG_LENGTH = 3;
  var MAX_HASHTAG_LENGTH = 20;
  var MAX_HASHTAG_NUMBER = 5;

  //  поле загрузки фото, окно предпросмотра фото, кнопка закрытия окна, форма
  var uploadFile = document.querySelector('#upload-file');
  var uploadFileLabel = document.querySelector('.upload-control');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadFormClose = document.querySelector('.upload-form-cancel');
  var form = document.querySelector('#upload-select-image');

  //  функция закрытия окна превью по нажатии на Escape
  var onOverlayCloseEscPress = function (evt) {
    if (evt.keyCode === window.keys.ESC_KEYCODE) {
      evt.stopPropagation();
      closeForm();
    }
  };

  //  функция закрытия окна превью по нажатии на Enter
  var onOverlayCloseEnterPress = function (evt) {
    if (evt.keyCode === window.keys.ENTER_KEYCODE) {
      closeForm();
    }
  };

  //  функция открытия окна превью
  var onUploadFileChange = function () {
    window.previewFile();
    uploadOverlay.classList.remove('hidden');

    //  закрываем по клику
    uploadFormClose.addEventListener('click', onUploadOverlayCloseClick);
    //  закрываем по нажатии на Escape
    document.addEventListener('keydown', onOverlayCloseEscPress);
    //  закрываем по нажатии на Enter, если крестик в фокусе
    uploadFormClose.addEventListener('keydown', onOverlayCloseEnterPress);
  };

  //  закрытие окна превью
  var onUploadOverlayCloseClick = function () {
    closeForm();
  };

  var closeForm = function () {
    uploadOverlay.classList.add('hidden');
    form.reset();
    uploadFile.value = '';
    filterFunctions.onEffectNoneButtonClick();

    //  удаляем обработчики по закрытию окна
    uploadFormClose.removeEventListener('click', onUploadOverlayCloseClick);
    document.removeEventListener('keydown', onOverlayCloseEscPress);
    uploadFormClose.removeEventListener('keydown', onOverlayCloseEnterPress);
  };

  //  показываем диалог загрузки файла по нажатию на Enter
  uploadFileLabel.addEventListener('keydown', function (evt) {
    if (evt.keyCode === window.keys.ENTER_KEYCODE) {
      uploadFile.click();
    }
  });

  //  показываем окно превью по изменению значения
  uploadFile.addEventListener('change', onUploadFileChange);

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
    if (parseInt(sizeValue.value, 10) < MAX_SCALE) {
      sizeValue.value = parseInt(sizeValue.value, 10) + SCALE_STEP;
      calculateScale();
    }
  };

  //  уменьшение масштаба фото
  var onDecreaseButtonClick = function () {
    if (parseInt(sizeValue.value, 10) > MIN_SCALE) {
      sizeValue.value = parseInt(sizeValue.value, 10) - SCALE_STEP;
      calculateScale();
    }
  };

  //  обработчик нажатия на кнопку увеличения
  increaseButton.addEventListener('click', onIncreaseButtonClick);
  //  обработчик нажатия на кнопку увеличения
  decreaseButton.addEventListener('click', onDecreaseButtonClick);

  //  слайдер, ползунок, значение ползунка
  var uploadEffectControls = document.querySelector('.upload-effect-level');
  var sliderPin = document.querySelector('.upload-effect-level-pin');
  var effectLevel = document.querySelector('.upload-effect-level-value');

  //  флаг
  var sliderPinIsDragged = false;

  var startCoordsX;
  var sliderWidth;

  //  обработчик перетаскивания пина
  var onPinPositionSliderMousemove = function (moveEvt) {
    moveEvt.preventDefault();

    sliderWidth = document.querySelector('.upload-effect-level-line').offsetWidth;

    var shift = startCoordsX - moveEvt.clientX;

    startCoordsX = moveEvt.clientX;

    sliderPin.style.left = (sliderPin.offsetLeft - shift) + 'px';

    //  не дает пину выйти за пределы шкалы
    if (parseInt(sliderPin.style.left, 10) <= MIN_LEFT_POSITION) {
      sliderPin.style.left = 0 + 'px';
    }
    if (parseInt(sliderPin.style.left, 10) >= sliderWidth) {
      sliderPin.style.left = sliderWidth + 'px';
    }
  };

  var currentAppliedFilterFunction;
  var currentAppliedCssClass;

  //  обработчик отпускания пина
  var onPinPositionSliderMouseup = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onPinPositionSliderMousemove);
    document.removeEventListener('mouseup', onPinPositionSliderMouseup);

    var windowWidth = window.innerWidth;

    //  определяем положение ползунка на слайдере
    var pinPositionOnSlider = startCoordsX - ((windowWidth - sliderWidth) / 2);
    if (pinPositionOnSlider < 0) {
      pinPositionOnSlider = 0;
    }

    sliderPinIsDragged = true;
    //  определяем пропорцию эффекта относительно положения ползунка
    effectLevel.value = (pinPositionOnSlider / sliderWidth).toFixed(2);
    filterFunctions[currentAppliedFilterFunction]();
  };

  //  обработчик нажатия кнопки на пине
  sliderPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    startCoordsX = evt.clientX;
    //  обработчик пертаскивания пина
    document.addEventListener('mousemove', onPinPositionSliderMousemove);
    //  обработчик отпускания пина
    document.addEventListener('mouseup', onPinPositionSliderMouseup);
  });

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

  var clearLastCssClass = function (cssClass) {
    imagePreview.classList.remove(currentAppliedCssClass);
    currentAppliedCssClass = cssClass;
    imagePreview.classList.add(currentAppliedCssClass);
  };

  //  объект с фильтрами
  var filterFunctions = {
    //  сбрасывает остальные классы
    onAnyEffectClick: function (cssClass) {
      // проверяет состояние ползунка и при необходимости сбрасывает значение фильтра
      if (!sliderPinIsDragged) {
        effectLevel.value = 1;
        sliderPin.style.left = sliderWidth + 'px';
      }
      sliderPinIsDragged = false;

      clearLastCssClass(cssClass);
    },

    //  переключает на оригинал
    onEffectNoneButtonClick: function () {
      hideUploadEffectControls();
      filterFunctions.onAnyEffectClick();

      currentAppliedFilterFunction = 'onEffectNoneButtonClick';
      imagePreview.style.filter = '';
    },

    //  переключает на "хром"
    onEffectChromeButtonClick: function () {
      showUploadEffectControls();
      filterFunctions.onAnyEffectClick('effect-chrome');

      currentAppliedFilterFunction = 'onEffectChromeButtonClick';
      imagePreview.style.filter = 'grayscale(' + effectLevel.value + ')';
    },

    //  переключает на "сепию"
    onEffectSepiaButtonClick: function () {
      showUploadEffectControls();
      filterFunctions.onAnyEffectClick('effect-sepia');

      currentAppliedFilterFunction = 'onEffectSepiaButtonClick';
      imagePreview.style.filter = 'sepia(' + effectLevel.value + ')';
    },

    //  переключает на "марвин"
    onEffectMarvinButtonClick: function () {
      showUploadEffectControls();
      filterFunctions.onAnyEffectClick('effect-marvin');

      currentAppliedFilterFunction = 'onEffectMarvinButtonClick';
      imagePreview.style.filter = 'invert(' + ((effectLevel.value * 10) + '%') + ')';
    },

    //  переключает на "фобос"
    onEffectFobosButtonClick: function () {
      showUploadEffectControls();
      filterFunctions.onAnyEffectClick('effect-fobos');

      currentAppliedFilterFunction = 'onEffectFobosButtonClick';
      imagePreview.style.filter = 'blur(' + ((effectLevel.value * 3) + 'px') + ')';
    },

    //  переключает на "зной"
    onEffectHeatButtonClick: function () {
      showUploadEffectControls();
      filterFunctions.onAnyEffectClick('effect-heat');

      currentAppliedFilterFunction = 'onEffectHeatButtonClick';
      imagePreview.style.filter = 'brightness(' + (effectLevel.value * 3) + ')';
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
  var uploadFormHashtagField = document.querySelector('.upload-form-hashtags');
  var hashtags = [];

  //  обработчик поля ввода хэштегов
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
    if (hashtags.length > MAX_HASHTAG_NUMBER) {
      target.setCustomValidity('Не больше 5 хэштегов.');
      return;
    }

    //  валидация хэштегов: мин. длина, макс. длина, знак решетки, пробелы
    for (var i = 0; i < hashtags.length; i++) {
      if (hashtags[i].length < MIN_HASHTAG_LENGTH) {
        target.setCustomValidity('Минимальная длина хэштега - 3 знака. В строке не должно быть лишних пробелов.');
        break;
      } else if (hashtags[i].length > MAX_HASHTAG_LENGTH) {
        target.setCustomValidity('Максимальная длина хэштега - 20 знаков.');
        break;
      } else if (!pattern.test(hashtags[i])) {
        target.setCustomValidity('Хэштег должен начинаться с решетки.');
        break;
      } else if (hashtags[i].indexOf(',') !== -1 || hashtags[i].indexOf(';') !== -1) {
        target.setCustomValidity('Хэштеги нужно отделять пробелами.');
        break;
      } else {
        target.setCustomValidity('');
      }
    }
  });

  //  отправляем данные формы через xhr
  form.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.upload(new FormData(form), closeForm, window.showAlertMessage);
  });

  //  поле комментария
  var commentField = document.querySelector('.upload-form-description');

  //  не позволяет закрыть форму, если поле комментария в фокусе
  commentField.addEventListener('focus', function () {
    document.removeEventListener('keydown', onOverlayCloseEscPress);

    //  позволяет закрыть форму, когда поле комментария больше не в фокусе
    commentField.addEventListener('blur', function () {
      document.addEventListener('keydown', onOverlayCloseEscPress);
    });
  });

})();
