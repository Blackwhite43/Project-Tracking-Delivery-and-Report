const express = require("express");
const deliveryController = require("../controllers/deliveryController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router.route('/')
    .get(deliveryController.get_alldata)
router.route('/:id')
    .patch(adminController.update_verification)

module.exports = router;