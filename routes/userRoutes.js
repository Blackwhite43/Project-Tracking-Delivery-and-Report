const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/home')
    .post(userController.get_data_plat_home)
router.route('/delivery-data')
    .post(userController.get_data_plat)
router.route('/update-delivery/:id')
    .patch(userController.update_delivery)

module.exports = router;