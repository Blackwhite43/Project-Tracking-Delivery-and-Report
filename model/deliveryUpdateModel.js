const mongoose = require("mongoose");
const deliveryupdateSchema = new mongoose.Schema({
    status_delivery: {
        type: String,
        enum: {
            values: ["Ready for Delivery", "Out for Delivery", "Delivered", "Not Delivered"]
        },
        default: "Ready for Delivery"
    },
    photo: {
        type: String
    },
    verification: {
        type: String,
        enum: {
            values: ["Verified by Delivery Team", "Pending"]
        },
        default: 'Pending'
    }
}, {timestamps: true})
const DeliveryUpdate = mongoose.model('deliveryUpdate', deliveryupdateSchema);
module.exports = DeliveryUpdate;