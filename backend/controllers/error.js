const NotFoundError = require('../errors/not-found-err.js');

const getError = (req, res) => {
  throw new NotFoundError('Запрашиваемый ресурс не найден');
};

module.exports = getError;
