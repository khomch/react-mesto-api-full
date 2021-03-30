const Card = require('../models/card.js');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;


const getUserId = (req) => {
  const token = req.headers.authorization;
  const payload = jwt.verify(token, JWT_SECRET_KEY);

  return payload._id
}



class NoCardError extends Error {
  constructor(name, message) {
    super(message);
    this.name = name;
  }
}

const getCards = (req, res) => (
  Card.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch((err) => res.status(500).send({
      message: err.message,
    }))
);

const createCard = (req, res) => {
  const {
    name,
    link,
  } = req.body; // получим из объекта запроса имя и ссылку на карточку
  Card.create({
    name,
    link,
    owner: getUserId(req),
  })
    .then((card) => res.status(200).send(card))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: `Ошибка валидации данных — ${err.message}`,
        });
      }
      res.status(500).send({
        message: 'Произошла ошибка',
      });
    });
};

const deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NoCardError('cardNotFound', 'Нет карточки с таким id');
      }
      else if (card.owner !== getUserId(req)) {
        throw new NoCardError('accessDenied', 'Нет доступа');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Введены некорректные данные — ${err.message}`,
        });
      } else if (err.name === 'cardNotFound') {
        res.status(404).send({
          message: `Ошибка — ${err.message}`,
        });
      }
      else if (err.name === 'accessDenied') {
        res.status(400).send({
          message: `Ошибка — ${err.message}`,
        });
      }
      res.status(500).send({
        message: `Произошла ошибка — ${err.message}`,
      });
    });
};

const likeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $addToSet: {
      likes: getUserId(req),
    },
  }, // добавить _id в массив, если его там нет
  {
    new: true,
  })
    .then((card) => {
      if (!card) {
        throw new NoCardError('cardNotFound', 'Нет карточки с таким id');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Введены некорректные данные — ${err.message}`,
        });
      } else if (err.name === 'cardNotFound') {
        res.status(404).send({
          message: `Ошибка — ${err.message}`,
        });
      }
      res.status(500).send({
        message: `Произошла ошибка — ${err.message}`,
      });
    });
};

const deleteLikeCard = (req, res) => {
  Card.findByIdAndUpdate(req.params.cardId, {
    $pull: {
      likes: getUserId(req),
    },
  },
  {
    new: true,
  })
    .then((card) => {
      if (!card) {
        throw new NoCardError('cardNotFound', 'Нет карточки с таким id');
      }
      return res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({
          message: `Введены некорректные данные — ${err.message}`,
        });
      } else if (err.name === 'cardNotFound') {
        res.status(404).send({
          message: `Ошибка — ${err.message}`,
        });
      }
      res.status(500).send({
        message: `Произошла ошибка — ${err.message}`,
      });
    });
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};