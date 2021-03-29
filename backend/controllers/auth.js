const { NODE_ENV, JWT_SECRET_KEY } = process.env;
const User = require('../models/user.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {
  generateSign
} = require('../middlewares/auth');

const MONGO_DUBLICATE_ERROR = 11000;
const SALT_ROUNDS = 10;

class NoUserError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}



const createUser = (req, res) => {
  const {
    name,
    about,
    avatar,
    email,
    password
  } = req.body;
  if (!email || !password) {
    return res.status(400).send({
      message: 'Не передан емейл или пароль'
    });
  }

  bcrypt
    .hash(password, SALT_ROUNDS)
    .then(hash => {
      return User.create({
        name,
        about,
        avatar,
        email,
        password: hash
      })
    })
    .then(() => {
      return res.status(200).send({
        message: 'Пользователь создан'
      })
    })
    .catch(err => {
      console.log(err);
      if (err.code === MONGO_DUBLICATE_ERROR) {
        res.status(409).send({
          message: 'Такой пользователь уже существует'
        })
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Ошибка валидации данных — ${err.message}`,
        });
      }
      res.status(500).send({
        message: 'Не удалось зарегистрировать пользователя'
      })
    })

};



const login = (req, res) => {
  const {
    email,
    password
  } = req.body;

  if (!email || !password) {
    return res.status(400).send({
      message: 'Не передан емейл или пароль'
    });
  }

  User
    .findOne({
      email
    }).select('+password')
    .then(user => {
      if (!user) {
        return res.status(400).send({
          message: 'Неверный имейл или пароль'
        })
      }
      return {
        user,
        isPasswordsEqual: bcrypt.compare(password, user.password)
      }
    })
    .then(({
      user,
      isPasswordsEqual
    }) => {
      if (!isPasswordsEqual) {
        return res.status(401).send({
          message: 'Неверный имейл или пароль'
        })
      }

      const token = generateSign({
        _id: user._id
      })

      res.status(200).send({
        token: token
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).send({
        message: 'Не удалось авторизовать пользователя'
      })
    })
}

module.exports = {
  createUser,
  login
}