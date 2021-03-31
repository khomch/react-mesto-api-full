const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
  login,
} = require('../controllers/auth');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .email(),
    password: Joi.string().required().min(2),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().min(2).max(30)
      .email(),
    password: Joi.string().required().min(2),
  }),
}), createUser);

module.exports = router;
