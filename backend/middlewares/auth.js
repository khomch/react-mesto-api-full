const jwt = require('jsonwebtoken');

const NoTokenError = require('../errors/no-token-err');

const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const generateSign = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret', { expiresIn: '7d' });

function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NoTokenError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret');
  } catch (err) {
    throw new NoTokenError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
}

module.exports = {
  auth,
  generateSign,
  // isAuthorized
};
