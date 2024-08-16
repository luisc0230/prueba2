var express = require('express');
var router = express.Router();

const checkoutController = require("../controllers/paidController");

/* GET home page. */
router.get('/', checkoutController.home);
router.post('/ipn', checkoutController.ipn);
router.post('/url', checkoutController.urlFlutter);

module.exports = router;
