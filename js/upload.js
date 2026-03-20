//
// // js/upload.js
//
// // --- Функция инициализации логики загрузки ---
// const initUpload = () => {
//
//   let selectedFile = null;
//
//
//   const cancelButton = document.querySelector('#upload-cancel');
//
// // Обработчик
//   const onCancelClick = () => {
//     resetForm();               // уже есть у тебя — сбрасывает масштаб, эффект, поля и т.д.
//     closeUploadOverlay();      // скрывает оверлей
//     fileInput.value = '';      // на всякий случай ещё раз очищаем input type="file"
//   };
//
//
//   // --- Текущие переменные ---
//   const fileInput = document.querySelector('#upload-file');
//   const overlay = document.querySelector('.img-upload__overlay');
//   const body = document.body;
//   const previewImg = document.querySelector('.img-upload__preview img');
//   const scaleValueInput = document.querySelector('.scale__control--value');
//
//   // --- Новые переменные для эффектов и слайдера ---
//   const effectsList = document.querySelector('.effects__list');
//   const effectLevelContainer = document.querySelector('.img-upload__effect-level');
//   const effectLevelValueInput = document.querySelector('.effect-level__value');
//   const sliderElement = document.querySelector('.effect-level__slider');
//
//   // --- Переменные для валидации ---
//   const uploadForm = document.querySelector('.img-upload__form');
//   const hashtagsField = document.querySelector('.text__hashtags');
//   const descriptionField = document.querySelector('.text__description');
//
//   // --- Переменные для отправки ---
//   const uploadSubmitButton = document.querySelector('#upload-submit'); // Кнопка "Опубликовать"
//
//   // --- Конфигурация эффектов ---
//   const EFFECTS = [
//     { name: 'none', style: '', range: { min: 0, max: 1 }, step: 0.1, unit: '' },
//     { name: 'chrome', style: 'grayscale', range: { min: 0, max: 1 }, step: 0.1, unit: '' },
//     { name: 'sepia', style: 'sepia', range: { min: 0, max: 1 }, step: 0.1, unit: '' },
//     { name: 'marvin', style: 'invert', range: { min: 0, max: 100 }, step: 1, unit: '%' },
//     { name: 'phobos', style: 'blur', range: { min: 0, max: 3 }, step: 0.1, unit: 'px' },
//     { name: 'heat', style: 'brightness', range: { min: 1, max: 3 }, step: 0.1, unit: '' }
//   ];
//
//   // --- Настройки масштаба ---
//   const MIN_SCALE = 25;
//   const MAX_SCALE = 100;
//   const SCALE_STEP = 25;
//
//   // --- Настройки валидации ---
//   const HASHTAG_CONSTRAINTS = {
//     MAX_COUNT: 5,
//     MAX_LENGTH: 20,
//     PATTERN: /^#[A-Za-zА-Яа-яЁё0-9]+$/
//   };
//
//   // --- Функции ---
//
//   cancelButton.addEventListener('click', onCancelClick);
//
//   // И по Esc тоже закрывать форму (если оверлей открыт)
//   const onEscKeydown = (evt) => {
//     if (evt.key === 'Escape' && !overlay.classList.contains('hidden')) {
//       evt.preventDefault();
//       resetForm();
//       closeUploadOverlay();
//       fileInput.value = '';
//     }
//   };
//
//   document.addEventListener('keydown', onEscKeydown);
//
//   // Функция показа любого сообщения (success или error)
//   const showMessage = (templateId) => {
//     const template = document.querySelector(`#${templateId}`);
//     if (!template) return;
//
//     // Клонируем содержимое шаблона
//     const message = template.content.cloneNode(true).firstElementChild;
//
//     // Добавляем в body (перед </body> — автоматически в конец)
//     document.body.append(message);
//
//     // Фокус на кнопке (удобно для клавиатуры)
//     const button = message.querySelector('button');
//     if (button) button.focus();
//
//     // Закрытие по кнопке
//     const closeByButton = () => message.remove();
//
//     // Закрытие по Esc
//     const closeByEsc = (evt) => {
//       if (evt.key === 'Escape') {
//         message.remove();
//         document.removeEventListener('keydown', closeByEsc);
//       }
//     };
//
//     // Закрытие по клику вне сообщения
//     const closeByOverlay = (evt) => {
//       if (evt.target === message) {
//         message.remove();
//         document.removeEventListener('click', closeByOverlay);
//       }
//     };
//
//     // Вешаем слушатели
//     button?.addEventListener('click', closeByButton);
//     document.addEventListener('keydown', closeByEsc);
//     document.addEventListener('click', closeByOverlay);
//
//     // Чтобы не вешать слушатели повторно при быстром открытии — можно добавить флаг,
//     // но для учебного проекта обычно достаточно так
//   };
//
//   // Удобные обёртки
//   const showSuccessMessage = () => showMessage('success');
//   const showErrorMessage = () => showMessage('error');
//
//   // Новая функция: инициализирует слайдер noUiSlider
//   const initEffectSlider = (config) => {
//     if (typeof noUiSlider === 'undefined') {
//       console.error('noUiSlider не загружен! Проверь vendor/nouislider/nouislider.min.js');
//       return;
//     }
//
//     if (sliderElement.noUiSlider) {
//       sliderElement.noUiSlider.destroy();
//     }
//
//     noUiSlider.create(sliderElement, {
//       range: config.range,
//       start: config.range.min,
//       step: config.step,
//       connect: 'lower',
//     });
//
//     if (config.name === 'none') {
//       effectLevelContainer.classList.add('hidden');
//       effectLevelValueInput.value = '';
//     } else {
//       effectLevelContainer.classList.remove('hidden');
//     }
//
//     sliderElement.noUiSlider.on('update', (values, handle) => {
//       const value = values[handle];
//       effectLevelValueInput.value = value;
//       updatePreviewFilter(config, value);
//     });
//   };
//
//
//
//   const openUploadOverlay = () => {
//     updateScale(MAX_SCALE);
//     document.getElementById('effect-none').checked = true;
//     updateEffect();
//     overlay.classList.remove('hidden');
//     body.classList.add('modal-open');
//
//     // --- Сброс ошибок при открытии формы ---
//     hideAllErrors();
//     // ----------------------------------------
//   };
//
//   const updateScale = (percent) => {
//     const newPercent = Math.min(Math.max(percent, MIN_SCALE), MAX_SCALE);
//     scaleValueInput.value = `${newPercent}%`;
//     previewImg.style.transform = `scale(${newPercent / 100})`;
//   };
//
//   const decreaseScale = () => {
//     const currentValue = parseInt(scaleValueInput.value, 10);
//     const newValue = currentValue - SCALE_STEP;
//     updateScale(newValue);
//   };
//
//   const increaseScale = () => {
//     const currentValue = parseInt(scaleValueInput.value, 10);
//     const newValue = currentValue + SCALE_STEP;
//     updateScale(newValue);
//   };
//
//   const updatePreviewFilter = (config, intensity) => {
//     if (config.name === 'none') {
//       previewImg.style.filter = '';
//       return;
//     }
//     previewImg.style.filter = `${config.style}(${intensity}${config.unit})`;
//   };
//
//   const updateEffect = () => {
//     const selectedEffect = effectsList.querySelector('.effects__radio:checked');
//     const effectName = selectedEffect.value;
//     const effectConfig = EFFECTS.find((effect) => effect.name === effectName);
//
//     previewImg.className = 'img-upload__preview img-upload__preview--default';
//
//     if (effectName !== 'none') {
//       previewImg.classList.add(`effects__preview--${effectName}`);
//     }
//
//     initEffectSlider(effectConfig);
//
//     if (effectConfig.name !== 'none') {
//       sliderElement.noUiSlider.set(effectConfig.range.min);
//     } else {
//       previewImg.style.filter = '';
//       effectLevelValueInput.value = '';
//     }
//   };
//
//   const previewImage = (file) => {
//     previewImg.src = URL.createObjectURL(file);
//     updateScale(MAX_SCALE);
//     document.getElementById('effect-none').checked = true;
//     updateEffect();
//   };
//
//   // --- НОВЫЕ ФУНКЦИИ ВАЛИДАЦИИ (вручную) ---
//
//   // Валидатор для хэштегов
//   const validateHashtags = (value) => {
//     if (!value) { // Пустая строка валидна
//       return { isValid: true, message: '' };
//     }
//
//     const tags = value.trim().split(/\s+/).filter(tag => tag !== '');
//
//     if (tags.length > HASHTAG_CONSTRAINTS.MAX_COUNT) {
//       return { isValid: false, message: `Нельзя указать больше ${HASHTAG_CONSTRAINTS.MAX_COUNT} хэш-тегов.` };
//     }
//
//     const seenTags = new Set();
//     for (const tag of tags) {
//       if (tag.length > HASHTAG_CONSTRAINTS.MAX_LENGTH) {
//         return { isValid: false, message: `Максимальная длина одного хэш-тега ${HASHTAG_CONSTRAINTS.MAX_LENGTH} символов.` };
//       }
//       if (!HASHTAG_CONSTRAINTS.PATTERN.test(tag)) {
//         return { isValid: false, message: 'Хэш-теги должны начинаться с # и содержать только буквы и цифры.' };
//       }
//       const lowerTag = tag.toLowerCase();
//       if (seenTags.has(lowerTag)) {
//         return { isValid: false, message: 'Хэш-теги не должны повторяться.' };
//       }
//       seenTags.add(lowerTag);
//     }
//     return { isValid: true, message: '' }; // Все проверки пройдены
//   };
//
//   // Валидатор для комментария
//   const validateDescription = (value) => {
//     if (value.length > 140) {
//       return { isValid: false, message: 'Комментарий не должен превышать 140 символов.' };
//     }
//     return { isValid: true, message: '' };
//   };
//
//   // --- ФУНКЦИИ ОТОБРАЖЕНИЯ ОШИБОК (вручную) ---
//
//   // Функция для показа ошибки под полем
//   const showError = (field, message) => {
//     const wrapper = field.closest('.img-upload__field-wrapper');
//     if (!wrapper) {
//       console.error('Родительский .img-upload__field-wrapper не найден для поля:', field);
//       return;
//     }
//
//     let errorElement = wrapper.querySelector('.error-message');
//     if (!errorElement) {
//       errorElement = document.createElement('div');
//       errorElement.className = 'error-message';
//       errorElement.style.color = 'red';
//       errorElement.style.fontSize = '0.8em';
//       errorElement.style.marginTop = '2px';
//       errorElement.style.display = 'block';
//       wrapper.appendChild(errorElement);
//     }
//
//     errorElement.textContent = message;
//     wrapper.classList.add('img-upload__field-wrapper--invalid');
//   };
//
//   // Функция для скрытия ошибки под полем
//   const hideError = (field) => {
//     const wrapper = field.closest('.img-upload__field-wrapper');
//     if (!wrapper) {
//       return;
//     }
//
//     const errorElement = wrapper.querySelector('.error-message');
//     if (errorElement) {
//       errorElement.remove();
//     }
//
//     wrapper.classList.remove('img-upload__field-wrapper--invalid');
//   };
//
//   // Функция для сброса всех ошибок
//   const hideAllErrors = () => {
//     hideError(hashtagsField);
//     hideError(descriptionField);
//   };
//
//   // --- ФУНКЦИЯ ОБЩЕЙ ВАЛИДАЦИИ ФОРМЫ ---
//   const validateForm = () => {
//     let isFormValid = true;
//
//     const hashtagValidationResult = validateHashtags(hashtagsField.value);
//     if (!hashtagValidationResult.isValid) {
//       showError(hashtagsField, hashtagValidationResult.message);
//       isFormValid = false;
//     } else {
//       hideError(hashtagsField);
//     }
//
//     const descriptionValidationResult = validateDescription(descriptionField.value);
//     if (!descriptionValidationResult.isValid) {
//       showError(descriptionField, descriptionValidationResult.message);
//       isFormValid = false;
//     } else {
//       hideError(descriptionField);
//     }
//
//     return isFormValid;
//   };
//
//
//   // --- ФУНКЦИЯ ОТПРАВКИ ДАННЫХ НА СЕРВЕР ---
//   const sendData = async (formData) => {
//     console.log('🚀 ОТПРАВКА НА СЕРВЕР');
//
//     const SERVER_URL = 'https://25.javascript.htmlacademy.pro/kekstagram';
//
//     const response = await fetch(SERVER_URL, {
//       method: 'POST',
//       body: formData,
//     });
//
//     if (!response.ok) {
//       throw new Error(`Ошибка сервера: ${response.status}`);
//     }
//
//     return response;
//   };
//
//   // --- ФУНКЦИЯ СБРОСА ФОРМЫ ---
//   const resetForm = () => {
//     // Сбросим поля формы (hashtags, description)
//     uploadForm.reset();
//
//     // Сбросим масштаб к 100%
//     updateScale(MAX_SCALE);
//
//     // Сбросим эффект на "none"
//     document.getElementById('effect-none').checked = true;
//     updateEffect(); // Применим сброс эффекта и слайдера
//
//     // Сбросим выбранное изображение
//     fileInput.value = '';
//
//     // Сбросим ошибки
//     hideAllErrors();
//
//     console.log('Форма сброшена.');
//   };
//
//   // --- ФУНКЦИЯ ЗАКРЫТИЯ ФОРМЫ РЕДАКТИРОВАНИЯ ---
//   const closeUploadOverlay = () => {
//     overlay.classList.add('hidden');
//     body.classList.remove('modal-open');
//     console.log('Форма закрыта.');
//   };
//
//
//
//   // --- Обработчик отправки формы (с новой валидацией и отправкой) ---
//
//   uploadForm.addEventListener('submit', async (evt) => {
//     evt.preventDefault();
//
//     if (!validateForm()) {
//       return;
//     }
//
//     const formData = new FormData(uploadForm);
//
//     // Добавляем поля, которых нет в HTML-разметке
//     formData.set('scale', scaleValueInput.value);          // перезаписываем или добавляем
//     formData.set('effect', effectsList.querySelector('.effects__radio:checked').value);
//
//     // hashtags уже есть в форме как <input name="hashtags">,
//     // но если ты хочешь отправлять как массив (hashtags[]), то можно так:
//     // (обычно сервер принимает и просто строку с пробелами)
//     // Если сервер требует именно массив — тогда:
//     // formData.delete('hashtags');
//     // const tags = hashtagsField.value.trim().split(/\s+/).filter(Boolean);
//     // tags.forEach(tag => formData.append('hashtags[]', tag));
//
//     try {
//       uploadSubmitButton.disabled = true;
//       uploadSubmitButton.textContent = 'Публикую...';
//
//       await sendData(formData);
//
//       resetForm();
//       closeUploadOverlay();
//       showSuccessMessage();
//
//     } catch (err) {
//       console.error('Ошибка отправки:', err);
//       showErrorMessage(err.message || 'Не удалось загрузить фото');
//     } finally {
//       uploadSubmitButton.disabled = false;
//       uploadSubmitButton.textContent = 'Опубликовать';
//     }
//   });
//
//   // --- Обработчики других событий ---
//
//   fileInput.addEventListener('change', () => {
//     if (fileInput.files.length > 0) {
//       selectedFile = fileInput.files[0];
//       // const selectedFile = fileInput.files[0];
//       previewImage(selectedFile);
//       openUploadOverlay();
//     }
//   });
//
//   document.querySelector('.scale__control--smaller').addEventListener('click', decreaseScale);
//   document.querySelector('.scale__control--bigger').addEventListener('click', increaseScale);
//
//   effectsList.addEventListener('change', (evt) => {
//     if (evt.target.classList.contains('effects__radio')) {
//       updateEffect();
//     }
//   });
//
//   // --- Инициализация ---
//   updateScale(MAX_SCALE);
//
//   console.log('Логика загрузки изображений инициализирована.');
//
// };
//
// // --- Ждём полной загрузки DOM ---
// document.addEventListener('DOMContentLoaded', initUpload);


//упрощенный вариант
// upload.js

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.img-upload__form');
  const overlay = document.querySelector('.img-upload__overlay');
  const cancelBtn = document.querySelector('#upload-cancel');
  const fileInput = document.querySelector('#upload-file');
  const previewImg = document.querySelector('.img-upload__preview img');
  const scaleInput = document.querySelector('.scale__control--value');
  const submitBtn = document.querySelector('#upload-submit');
  const effectsList = document.querySelector('.effects__list');
  const effectLevel = document.querySelector('.img-upload__effect-level');
  const effectLevelValue = document.querySelector('.effect-level__value');
  const slider = document.querySelector('.effect-level__slider');
  const hashtags = document.querySelector('.text__hashtags');
  const description = document.querySelector('.text__description');

  let currentScale = 100;

  const MIN_SCALE = 25;
  const MAX_SCALE = 100;
  const SCALE_STEP = 25;

  const effects = {
    none:     { filter: '',        min: 0,   max: 1,   step: 0.1, unit: ''   },
    chrome:   { filter: 'grayscale', min: 0,   max: 1,   step: 0.1, unit: ''   },
    sepia:    { filter: 'sepia',     min: 0,   max: 1,   step: 0.1, unit: ''   },
    marvin:   { filter: 'invert',    min: 0,   max: 100, step: 1,   unit: '%'  },
    phobos:   { filter: 'blur',      min: 0,   max: 3,   step: 0.1, unit: 'px' },
    heat:     { filter: 'brightness',min: 1,   max: 3,   step: 0.1, unit: ''   }
  };

  // ────────────────────────────────────────────────
  // Масштаб
  // ────────────────────────────────────────────────

  const updateScale = (value) => {
    currentScale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, value));
    scaleInput.value = `${currentScale}%`;
    previewImg.style.transform = `scale(${currentScale / 100})`;
  };

  const changeScale = (delta) => updateScale(currentScale + delta * SCALE_STEP);

  // ────────────────────────────────────────────────
  // Эффекты и слайдер
  // ────────────────────────────────────────────────

  const updateEffect = () => {
    const effectName = effectsList.querySelector(':checked')?.value || 'none';
    const cfg = effects[effectName];

    previewImg.className = 'img-upload__preview';
    if (effectName !== 'none') {
      previewImg.classList.add(`effects__preview--${effectName}`);
    }

    if (slider.noUiSlider) slider.noUiSlider.destroy();

    if (effectName === 'none') {
      effectLevel.classList.add('hidden');
      previewImg.style.filter = '';
      effectLevelValue.value = '';
      return;
    }

    effectLevel.classList.remove('hidden');

    noUiSlider.create(slider, {
      start: cfg.min,
      range: { min: cfg.min, max: cfg.max },
      step: cfg.step,
      connect: 'lower'
    });

    slider.noUiSlider.on('update', ([val]) => {
      effectLevelValue.value = val;
      previewImg.style.filter = `${cfg.filter}(${val}${cfg.unit})`;
    });

    slider.noUiSlider.set(cfg.min);
  };

  // ────────────────────────────────────────────────
  // Превью выбранного файла
  // ────────────────────────────────────────────────

  const previewFile = (file) => {
    previewImg.src = URL.createObjectURL(file);
    updateScale(100);
    document.getElementById('effect-none').checked = true;
    updateEffect();
  };

  // ────────────────────────────────────────────────
  // Валидация
  // ────────────────────────────────────────────────

  const validateHashtags = (value) => {
    if (!value.trim()) return true;
    const tags = value.trim().split(/\s+/);
    if (tags.length > 5) return 'Нельзя указать больше 5 хэш-тегов';

    const seen = new Set();
    for (const tag of tags) {
      if (tag.length > 20) return 'Максимальная длина хэш-тега — 20 символов';
      if (!/^#[A-Za-zА-Яа-яЁё0-9]{1,19}$/.test(tag)) {
        return 'Хэш-теги должны начинаться с # и содержать только буквы и цифры';
      }
      const lower = tag.toLowerCase();
      if (seen.has(lower)) return 'Хэш-теги не должны повторяться';
      seen.add(lower);
    }
    return true;
  };

  const validateDescription = (value) => value.length <= 140 || 'Комментарий не должен превышать 140 символов';

  const showFieldError = (field, message) => {
    const wrapper = field.closest('.img-upload__field-wrapper');
    if (!wrapper) return;

    wrapper.querySelector('.error-message')?.remove();

    const err = document.createElement('div');
    err.className = 'error-message';
    err.textContent = message;
    wrapper.append(err);
    wrapper.classList.add('img-upload__field-wrapper--invalid');
  };

  const clearFieldError = (field) => {
    const wrapper = field.closest('.img-upload__field-wrapper');
    if (!wrapper) return;
    wrapper.querySelector('.error-message')?.remove();
    wrapper.classList.remove('img-upload__field-wrapper--invalid');
  };

  const isFormValid = () => {
    clearFieldError(hashtags);
    clearFieldError(description);

    let valid = true;

    const ht = validateHashtags(hashtags.value);
    if (ht !== true) {
      showFieldError(hashtags, ht);
      valid = false;
    }

    const desc = validateDescription(description.value);
    if (desc !== true) {
      showFieldError(description, desc);
      valid = false;
    }

    return valid;
  };

  // ────────────────────────────────────────────────
  // Сброс формы
  // ────────────────────────────────────────────────

  const resetForm = () => {
    form.reset();
    updateScale(100);
    document.getElementById('effect-none').checked = true;
    updateEffect();
    fileInput.value = '';
    document.querySelectorAll('.error-message').forEach(el => el.remove());
    document.querySelectorAll('.img-upload__field-wrapper--invalid')
      .forEach(el => el.classList.remove('img-upload__field-wrapper--invalid'));
  };

  const closeOverlay = () => {
    overlay.classList.add('hidden');
    document.body.classList.remove('modal-open');
  };

  // ────────────────────────────────────────────────
  // Сообщения success / error
  // ────────────────────────────────────────────────

  const showMessage = (templateId) => {
    const template = document.querySelector(`#${templateId}`);
    if (!template) return;

    const msg = template.content.cloneNode(true).firstElementChild;
    document.body.append(msg);

    const btn = msg.querySelector('button');
    const close = () => msg.remove();

    btn?.addEventListener('click', close);
    const escHandler = (e) => { if (e.key === 'Escape') { close(); document.removeEventListener('keydown', escHandler); } };
    document.addEventListener('keydown', escHandler);

    const clickOut = (e) => {
      if (e.target === msg) {
        close();
        document.removeEventListener('click', clickOut);
      }
    };
    document.addEventListener('click', clickOut);
  };

  // ────────────────────────────────────────────────
  // События
  // ────────────────────────────────────────────────

  fileInput.addEventListener('change', () => {
    const file = fileInput.files[0];
    if (file) {
      previewFile(file);
      overlay.classList.remove('hidden');
      document.body.classList.add('modal-open');
    }
  });

  cancelBtn.addEventListener('click', () => {
    resetForm();
    closeOverlay();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !overlay.classList.contains('hidden')) {
      if ([hashtags, description].includes(document.activeElement)) return;
      e.preventDefault();
      resetForm();
      closeOverlay();
    }
  });

  document.querySelector('.scale__control--smaller').addEventListener('click', () => changeScale(-1));
  document.querySelector('.scale__control--bigger').addEventListener('click', () => changeScale(1));

  effectsList.addEventListener('change', updateEffect);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!isFormValid()) return;

    submitBtn.disabled = true;
    submitBtn.textContent = 'Публикую...';

    try {
      const formData = new FormData(form);
      formData.set('scale', scaleInput.value);
      formData.set('effect', effectsList.querySelector(':checked').value);

      const res = await fetch('https://25.javascript.htmlacademy.pro/kekstagram', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) throw new Error(`Ошибка ${res.status}`);

      resetForm();
      closeOverlay();
      showMessage('success');
    } catch (err) {
      console.error(err);
      showMessage('error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Опубликовать';
    }
  });

  // Инициализация
  updateScale(100);
  updateEffect();
});
