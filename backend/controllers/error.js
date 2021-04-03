const NotFoundError = require('../errors/not-found-err.js');

const getError = () => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
};

module.exports = getError;
