const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const {
  createUser,
  login,
} = require('../controllers/auth');

router.post('/signin', login);
// router.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().min(2).max(30),
//     password: Joi.string().required().min(2),
//   }),
// }), login);
router.post('/signup', createUser);

module.exports = router;
