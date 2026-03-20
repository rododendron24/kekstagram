// miniatures.js
import { openBigPicture } from './big-picture.js';

const container = document.querySelector('.pictures');
const template = document.querySelector('#picture').content.querySelector('.picture');

const createPicture = ({ url, description, likes, comments }) => {
  const el = template.cloneNode(true);
  el.querySelector('.picture__img').src = url;
  el.querySelector('.picture__img').alt = description || 'Фотография';
  el.querySelector('.picture__likes').textContent = likes;
  el.querySelector('.picture__comments').textContent = comments.length;

  el.addEventListener('click', (e) => {
    e.preventDefault();
    openBigPicture({ url, description, likes, comments });
  });

  return el;
};

export const makePicturesShow = (photos) => {
  container.querySelectorAll('.picture').forEach(el => el.remove());

  const fragment = document.createDocumentFragment();
  photos.forEach(photo => fragment.append(createPicture(photo)));
  container.append(fragment);
};
