var express = require('express');
var router = express.Router();
const JWT_middleware = require('../middlewares/jwt-auth');
const urlController = require('../controllers/url-controller');

router.get('/:token', urlController.redirectUrl);
router.post('/', JWT_middleware, urlController.createShortUrl);
router.patch('/:token', JWT_middleware, urlController.updateUrl);
router.delete('/:token', JWT_middleware, urlController.deleteUrl);

module.exports = router;
