var express = require('express');
var router = express.Router();
const userController = require('../controllers/user-controller');

router.post('/signup', userController.signupUser);
router.post('/signin', userController.sigininUser);

module.exports = router;