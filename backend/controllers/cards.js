const Card = require('../models/card.js');
const BadRequest = require('../errors/bad-request.js');
const NotFoundError = require('../errors/not-found-err.js');
const DuplicateError = require('../errors/duplicate-err.js');

const getCards = (req, res, next) => (
  Card.find({})
    .then((cards) => {
      if (!cards) {
        throw new NotFoundError('Нет пользователя с таким id');
      } else {
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
    .catch(next);
};

const deleteCard = (req, res, next) => {
  if (req.params.cardId.length !== 24) {
    throw new BadRequest('Невалидный id карточки');
  } else {
    Card.findById(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Нет такой карточки');
        } else if (`${card.owner._id}` !== req.user._id) {
          throw new DuplicateError('Нельзя удалять чужие карточки');
        } else {
          Card.findByIdAndRemove(req.params.cardId)
            .then((cardDeleted) => {
              if (!cardDeleted) {
                throw new NotFoundError('Нет карточки с таким id');
              } else return res.status(200).send(cardDeleted);
            });
        }
      })
      .catch(next);
  }
};

const likeCard = (req, res, next) => {
  if (req.params.cardId.length !== 24) {
    throw new BadRequest('Невалдный id карточки');
  } else {
    Card.findById(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Нет такой карточки');
        } else {
          Card.findByIdAndUpdate(req.params.cardId, {
            $addToSet: {
              likes: req.user._id,
            },
          }, // добавить _id в массив, если его там нет
          {
            new: true,
          })
            .then((cardUpdated) => {
              if (!cardUpdated) {
                throw new NotFoundError('Нет карточки с таким id');
              }
              return res.status(200).send(cardUpdated);
            });
        }
      })
      .catch(next);
  }
};

const deleteLikeCard = (req, res, next) => {
  if (req.params.cardId.length !== 24) {
    throw new BadRequest('Невалдный id карточки');
  } else {
    Card.findById(req.params.cardId)
      .then((card) => {
        if (!card) {
          throw new NotFoundError('Нет такой карточки');
        } else {
          Card.findByIdAndUpdate(card._id, {
            $pull: {
              likes: req.user._id,
            },
          }, // добавить _id в массив, если его там нет
          {
            new: true,
          })
            .then((cardUpdated) => {
              if (!cardUpdated) {
                throw new NotFoundError('Нет карточки с таким id');
              }
              return res.status(200).send(cardUpdated);
            });
        }
      })
      .catch(next);
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  deleteLikeCard,
};
