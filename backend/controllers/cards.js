const jwt = require('jsonwebtoken');
const Card = require('../models/card.js');

const BadRequest = require('../errors/bad-request.js');
const NotFoundError = require('../errors/not-found-err.js');
const NoPermissionError = require('../errors/no-permission-err.js');


const getCards = (req, res, next) => (
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Нет пользователя с таким id');
      }
      else {
        res.status(200).send(cards);
      }
    })
    .catch(next)
);

const createCard = (req, res, next) => {
  const {
    name,
    link,
  } = req.body; // получим из объекта запроса имя и ссылку на карточку
  Card.create({
    name,
    link,
    owner: req.user._id,
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        throw new BadRequest('Ошибка валидации');
      }
    })
    .catch(next)
};

const deleteCard = (req, res, next) => {
  Card.findByIdAndRemove(req.params.cardId, (err, card) => {

  })
    .then((card) => {
      console.log(card)

      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      } else if (toString(card.owner) !== toString(req.user._id)) {
        throw new NoPermissionError('Нет доступа');
      }
      else return res.status(200).send(card);
    })
    .catch(next);
};

const likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: req.user._id,
    },
  }, // добавить _id в массив, если его там нет
  {
    new: true,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Введены некорректные данные');
      } else if (err.name === 'cardNotFound') {
        throw new NotFoundError('Нет карточки с таким id');
      }
    })
    .catch(next);
};

const deleteLikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: req.user._id,
    },
  },
  {
    new: true,
  })
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Нет карточки с таким id');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        throw new BadRequest('Введены некорректные данные');
      } else if (err.name === 'cardNotFound') {
        throw new NotFoundError('Нет карточки с таким id');
      }
    })
    .catch(next);
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
