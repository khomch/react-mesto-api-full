const { JWT_SECRET_KEY } = process.env;
const jwt = require('jsonwebtoken');

const User = require('../models/user.js');
const NotFoundError = require('../errors/not-found-err.js');

const getUserId = (req) => {
  const token = req.headers.authorization;
  const payload = jwt.verify(token, JWT_SECRET_KEY);

  return payload._id;
};

// class NoUserError extends Error {
//   constructor(name, message) {
//     super(message);
//     this.name = name;
//   }
// }

const getUsers = (req, res, next) => User.find({})
  .then((users) => {
    if (!users) {
      throw new NotFoundError('Пользователи не найдены');
    } else {
      return res.status(200).send(users);
    }
  })
  .catch(next);

const getUserProfile = (req, res, next) => {
  User.findOne({
    _id: getUserId(req),
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        return res.status(200).send(user);
      }
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body; // получим из объекта запроса имя, описание и аватар пользователя
  User.findByIdAndUpdate(getUserId(req), {
    name,
    about,
  }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const updateAvatar = (req, res, next) => {
  const {
    avatar,
  } = req.body;
  User.findByIdAndUpdate(getUserId(req), {
    avatar,
  }, {
    new: true,
    runValidators: true,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports = {
  getUsers,
  updateProfile,
  getUserProfile,
  updateAvatar,
};
