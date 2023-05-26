const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route('/')
    .get(deliveryController.get_alldata)
    .post(adminController.create_delivery_data)

router.route('/:id')
    .get(adminController.get_delivery_data)
    .patch(adminController.update_delivery_data)
    .delete(adminController.delete_delivery_data)

module.exports = router;