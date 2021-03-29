const router = require('express').Router();
const {
  getUsers,
  getUserProfile,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserProfile);
router.patch('/me', updateProfile);
router.patch('/me/avatar', updateAvatar);



module.exports = router;
