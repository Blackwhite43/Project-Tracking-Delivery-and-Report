const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/delivery-data')
    .get(userController.get_data_plat)
router.route('/update-delivery/:id')
    .patch(userController.update_delivery)

module.exports = router;