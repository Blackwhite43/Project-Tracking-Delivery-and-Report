const deliveryModel = require('../model/deliveryModel');
const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const factory = require('./handlerFactory');
const catchAsync = require('../utils/catchAsync');

function get_date(start, end) {
    var arr = [];
    var dateStart = new Date(start);
    var dateEnd = new Date(end);
    dateStart.setHours(0,0,0,0);
    dateEnd.setHours(23,59,59,0);
    arr[0] = dateStart;
    arr[1] = dateEnd;
    return arr;
}

exports.update_delivery_data = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findByIdAndUpdate(req.params.id, {
        $set: { verification: req.body.verification }
    });
    await deliveryModel.findOneAndUpdate({delivery_update: data}, {
        $set: {
            plat_no: req.body.plat_no,
            driver: req.body.driver,
            kenek: req.body.kenek,
            customer: req.body.customer,
            asal: req.body.asal,
            jumlah_surat_jalan: req.body.jumlah_surat_jalan,
            jenis_barang: req.body.jenis_barang,
            instruksi: req.body.instruksi
        }
    })
    res.status(200).json({
        status: 'success'
    })
})

exports.get_delivery_data = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findById(req.params.id);
    const data2 = await deliveryModel.findOne({
        delivery_update: data
    })
    res.status(200).json({
        status: 'success',
        total: data.length,
        data: data2
    })
})

exports.get_all_delivery_data_dates = catchAsync(async (req, res) => {
    var date = get_date(req.body.date_start, req.body.date_end);
    var dateStart = date[0]
    var dateEnd = date[1];
    console.log(dateStart, dateEnd);
    const data = await deliveryModel.find({
        $and: [
            {createdAt:{$gte: dateStart}},
            {createdAt:{$lte: dateEnd}}
        ]
    })
    res.status(200).json({
        status: 'success',
        total: data.length,
        data: data
    })
})

exports.delete_delivery_data = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findByIdAndDelete(req.params.id);
    await deliveryModel.findOneAndDelete({
        delivery_update: data
    })
    res.status(201).json({
        status: 'success'
    })
})

exports.create_delivery_data = factory.createOne(deliveryModel);