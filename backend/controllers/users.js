const User = require('../models/user.js');

const NotFoundError = require('../errors/not-found-err.js');
const BadRequest = require('../errors/bad-request.js');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      if (!users) {
        throw new NotFoundError('Пользователи не найдены');
      } else {
        return res.status(200).send(users);
      }
    })
    .catch(next);
};

const getUserProfile = (req, res, next) => {
  User.findOne({
    _id: req.user._id,
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

const getUserById = (req, res, next) => {
  if (req.params.userId.length !== 24 ) {
    throw new BadRequest('Невалдный id');
  }
    else {
    User.findOne({ _id: req.params.userId })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
        return res.status(200).send(user);
      }
    })
    .catch(next);
  }
};

const updateProfile = (req, res, next) => {
  const {
    name,
    about,
  } = req.body; // получим из объекта запроса имя, описание и аватар пользователя
  User.findByIdAndUpdate(req.user._id, {
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
  User.findByIdAndUpdate(req.user._id, {
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
  getUserById,
};
