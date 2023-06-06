const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route('/')
    .get(deliveryController.get_alldata)
    .post(adminController.create_delivery_data)

router.route('/custom-dates')
    .post(adminController.get_all_delivery_data_dates)

router.route('/:id')
    .get(adminController.get_delivery_data)
    .patch(adminController.update_delivery_data)
    .delete(adminController.delete_delivery_data)
router.route('/stats')
    .post(adminController.get_stats)

module.exports = router;