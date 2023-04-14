const express = require('express');
const deliveryUpdateController = require('../controllers/deliveryUpdateController');

const router = express.Router();
router.route('/')
    .get(deliveryUpdateController.get_alldata)
router.route('/:id')
    .get(deliveryUpdateController.get_data)

module.exports = router;