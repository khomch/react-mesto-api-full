
const jwt = require('jsonwebtoken');
const { NODE_ENV, JWT_SECRET_KEY } = process.env;

const User = require('../models/user');

const generateSign = (payload) => {
  return jwt.sign(payload, NODE_ENV === 'production' ? JWT_SECRET_KEY : 'dev-secret', { expiresIn: '7d' });
}

function isAuthorized(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).send({ message: 'Требуется авторизация' })
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET_KEY);
    User.findOne({ _id: payload._id })
      .then(admin => {
        if (!admin) {
          return res.status(404).send({ message: 'Пользователь не существует' })
        }
        next();
      })

      .catch(err => {
        res.status(500).send({ message: 'Ошибка сервера' })
      })

  } catch (err) {
      return res.status(403).send({ message: 'Нет доступа' })
  }
}

module.exports = { generateSign, isAuthorized }