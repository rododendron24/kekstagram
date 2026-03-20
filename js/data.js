export const loadPhotos = async () => {
  const url = 'https://25.javascript.htmlacademy.pro/kekstagram/data';
  const res = await fetch(url);

  if (!res.ok) throw new Error(`HTTP ${res.status}`);

  return res.json();
};

// // data.js
//
// /**
//  * Загружает данные фотографий с сервера.
//  * @returns {Promise<Object[]>} Промис, который резолвится с массивом объектов фотографий.
//  */
// const loadPhotos = async () => {
//   // Адрес сервера
//   const DATA_URL = 'https://25.javascript.htmlacademy.pro/kekstagram/data';
//
//   try {
//     // Делаем запрос к серверу
//     const response = await fetch(DATA_URL);
//
//     // Проверяем, успешен ли запрос (статус 200-299)
//     if (!response.ok) {
//       // Если нет, выбрасываем ошибку
//       throw new Error(`Ошибка сети: ${response.status}`);
//     }
//
//     // Парсим JSON из ответа
//     const photos = await response.json();
//
//     // Возвращаем полученный массив фотографий
//     return photos;
//   } catch (error) {
//     // Если произошла ошибка (например, сервер недоступен),
//     // выводим её в консоль и пробрасываем дальше, чтобы обработать в main.js
//     // eslint-disable-next-line no-console
//     console.error('Не удалось загрузить фотографии:', error);
//     throw error; // Пробрасываем ошибку, чтобы main.js мог показать сообщение пользователю
//   }
// };
//
// // Экспортируем функцию loadPhotos, чтобы использовать её в других файлах
// export { loadPhotos };
//

