const bcrypt = require('bcrypt');
const User = require('../models/user.js');
const {
  generateSign,
} = require('../middlewares/auth');

const BadRequest = require('../errors/bad-request.js');
const DuplicateError = require('../errors/duplicate-err');
const NoTokenError = require('../errors/no-token-err');

const MONGO_DUBLICATE_ERROR = 11000;
const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  if (!email || !password) {
    throw new NoTokenError('Не передан пароль или имейл');
  }
  bcrypt
    .hash(password, SALT_ROUNDS)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then(() => res.status(200).send({
      message: 'Пользователь создан',
    }))
    .catch((err) => {
      if (err.code === MONGO_DUBLICATE_ERROR) {
        throw new DuplicateError('Такой пользователь уже существует');
      }
      if (err.name === 'ValidationError') {
        throw new BadRequest('Ошибка валидации');
      }
    })
    .catch(next);
};

const login = (req, res, next) => {
  const {
    email,
    password,
  } = req.body;

  if (!email || !password) {
    throw new NoTokenError('Не передан пароль или имейл');
  }

  User
    .findOne({
      email,
    }).select('+password')
    .then((user) => {
      if (!user) {
        throw new BadRequest('Неверный емейл или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
          // хеши не совпали — отклоняем промис
            throw new NoTokenError('Неверный пароль или имейл');
          }

          const token = generateSign({
            _id: user._id,
          });
          res.status(200).send({
            token,
          });
        });
    })
    .catch(next);
};

module.exports = {
  createUser,
  login,
};
