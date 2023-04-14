const express = require("express");
const deliveryController = require("../controllers/deliveryController");

const router = express.Router();
router.route('/')
    .post(deliveryController.create_delivery_data)
    .get(deliveryController.get_alldata)
    .delete(deliveryController.delete_Alldata)
router.route('/:id')
    .patch(deliveryController.update_data)
    .get(deliveryController.get_data)
    .delete(deliveryController.delete_data)

module.exports = router