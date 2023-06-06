const mongoose = require('mongoose');
const deliveryUpdateModel = require('./deliveryUpdateModel');

const deliverySchema = new mongoose.Schema({
    plat_no: {
        type: String
    },
    driver: {
        type: String
    },
    kenek: {
        type: String
    },
    customer: {
        type: String
    },
    asal: {
        type: String
    },
    jumlah_surat_jalan: {
        type: Number
    },
    jenis_barang: {
        type: String
    },
    instruksi: {
        type: String
    },
    tanggal: {
        type: Date
    },
    delivery_update: {
        type: mongoose.Schema.ObjectId,
        ref: 'deliveryUpdate'
    }
}, {timestamps: true})

deliverySchema.pre('save', async function (next) {
    const update = await deliveryUpdateModel.create({tanggal: this.tanggal});
    this.plat_no = this.plat_no.toUpperCase();
    this.delivery_update = update;
    next();
})

deliverySchema.pre(/^find/, function (next) {
    this.populate({
        path: 'delivery_update'
    })
    next();
})

const Delivery = mongoose.model('Delivery', deliverySchema);
module.exports = Delivery;