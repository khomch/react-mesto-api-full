const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');


const {
  getUsers,
  getUserProfile,
  updateProfile,
  updateAvatar,
  getUserById,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserProfile);
router.get('/:userId', getUserById);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2),
    about: Joi.string().required().min(2)
  }),
}), updateProfile);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().required().min(2).regex(/^(ftp|http|https):\/\/[^ "]+$/),
  }),
}), updateAvatar);

module.exports = router;
