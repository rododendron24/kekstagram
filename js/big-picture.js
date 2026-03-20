// big-picture.js
const section = document.querySelector('.big-picture');
const img = section.querySelector('.big-picture__img img');
const likes = section.querySelector('.likes-count');
const caption = section.querySelector('.social__caption');
const shown = section.querySelector('.social__comment-shown-count');
const total = section.querySelector('.social__comment-total-count');
const commentsList = section.querySelector('.social__comments');
const loader = section.querySelector('.social__comments-loader');
const closeBtn = section.querySelector('.big-picture__cancel');

let comments = [];
let shownCount = 0;
const STEP = 5;

const createComment = ({ avatar, name, message }) => {
  const li = document.createElement('li');
  li.className = 'social__comment';

  li.innerHTML = `
    <img class="social__picture" src="${avatar}" alt="${name}" width="35" height="35">
    <p class="social__text">${message}</p>
  `;

  return li;
};

const showMoreComments = () => {
  const start = shownCount;
  const end = Math.min(start + STEP, comments.length);

  for (let i = start; i < end; i++) {
    commentsList.append(createComment(comments[i]));
  }

  shownCount = end;
  shown.textContent = shownCount;
  total.textContent = comments.length;

  loader.classList.toggle('hidden', shownCount >= comments.length);
};

export const openBigPicture = (photo) => {
  img.src = photo.url;
  img.alt = photo.description || 'Фотография';
  likes.textContent = photo.likes;
  caption.textContent = photo.description || '';

  comments = photo.comments.slice();
  shownCount = 0;
  commentsList.innerHTML = '';

  showMoreComments();

  section.classList.remove('hidden');
  document.body.classList.add('modal-open');
};

const closeBigPicture = () => {
  section.classList.add('hidden');
  document.body.classList.remove('modal-open');
};

closeBtn.addEventListener('click', closeBigPicture);
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && !section.classList.contains('hidden')) {
    e.preventDefault();
    closeBigPicture();
  }
});

loader.addEventListener('click', showMoreComments);
