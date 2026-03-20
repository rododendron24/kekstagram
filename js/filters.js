// filters.js
import { makePicturesShow } from './miniatures.js';

let allPhotos = [];
let currentFilter = 'filter-default';
let timeoutId = null;

const getRandomPhotos = () => {
  return [...allPhotos]
    .sort(() => Math.random() - 0.5)
    .slice(0, 10);
};

const getDiscussedPhotos = () => {
  return [...allPhotos].sort((a, b) => b.comments.length - a.comments.length);
};

const applyFilter = (filterId) => {
  if (filterId === currentFilter) return;

  let photosToShow = allPhotos;
  if (filterId === 'filter-random') photosToShow = getRandomPhotos();
  if (filterId === 'filter-discussed') photosToShow = getDiscussedPhotos();

  makePicturesShow(photosToShow);

  document.querySelectorAll('.img-filters__button').forEach(b => b.classList.remove('img-filters__button--active'));
  document.getElementById(filterId)?.classList.add('img-filters__button--active');

  currentFilter = filterId;
};

const onFilterClick = (evt) => {
  const btn = evt.target.closest('.img-filters__button');
  if (!btn) return;

  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => applyFilter(btn.id), 500);
};

export const initFilters = (photos) => {
  allPhotos = photos;

  const form = document.querySelector('.img-filters__form');
  if (form) {
    form.addEventListener('click', onFilterClick);
    document.getElementById('filter-default')?.classList.add('img-filters__button--active');
  }
};
