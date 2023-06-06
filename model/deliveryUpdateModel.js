const mongoose = require("mongoose");
const deliveryupdateSchema = new mongoose.Schema({
    status_delivery: {
        type: String,
        enum: {
            values: ["Ready for Delivery", "Delivered", "Not Delivered"]
        },
        default: "Ready for Delivery"
    },
    photo: {
        type: String
    },
    reason: {
        type: String
    },
    verification: {
        type: String,
        enum: {
            values: ["Verified by Delivery Team", "Pending"]
        },
        default: 'Pending'
    },
    tanggal: {
        type: Date
    }
}, {timestamps: true})
const DeliveryUpdate = mongoose.model('deliveryUpdate', deliveryupdateSchema);
module.exports = DeliveryUpdate;