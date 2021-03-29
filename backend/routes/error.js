const router = require('express').Router();
const getError = require('../controllers/error');

router.all('*', getError);

module.exports = router;
