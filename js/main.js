// main.js
import { loadPhotos } from './data.js';
import { makePicturesShow } from './miniatures.js';
import { initFilters } from './filters.js';

const initApp = async () => {
  try {
    const photos = await loadPhotos();
    makePicturesShow(photos);
    document.querySelector('.img-filters').classList.remove('img-filters--inactive');
    initFilters(photos);

    console.log('Фотографии загружены и отображены');
  } catch (error) {
    console.error('Ошибка загрузки данных:', error);

    const template = document.querySelector('#data-error')?.content.cloneNode(true);
    if (template) document.body.append(template);

    setTimeout(() => document.querySelector('.data-error')?.remove(), 5000);
  }
};

initApp();
