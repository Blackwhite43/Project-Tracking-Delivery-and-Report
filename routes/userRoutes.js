const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

router.route('/home')
    .post(userController.get_data_plat_home)
router.route('/delivery-data')
    .post(userController.get_data_plat)
router.route('/delivery-data/:id')
    .get(userController.get_update_delivery_data)
router.route('/update-delivery/:id')
    .patch(userController.uploadProblemsMedia, userController.saveMedia, userController.update_delivery)
router.route('/stats')
    .post(userController.get_stats)
router.route('/get-files/:id')
    .get(userController.get_file)
module.exports = router;