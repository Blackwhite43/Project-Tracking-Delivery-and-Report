const deliveryModel = require('../model/deliveryModel');
const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const catchAsync = require('../utils/catchAsync');

exports.get_data_plat = catchAsync(async (req, res) => {
    const data = await deliveryModel.find({
        plat_no: req.body.plat_no
    })
    res.status(200).json({
        status: 'success',
        total: data.length,
        data: data
    })
})

exports.get_data_plat_home = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.find({
        status_delivery: {$ne: "Delivered"}
    });
    const data2 = await deliveryModel.find({
        plat_no: req.body.plat_no,
        delivery_update: data
    })
    res.status(200).json({
        status: 'success',
        total: data2.length,
        data: data2
    })
})

exports.update_delivery = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findByIdAndUpdate(req.params.id, req.body);
    const data2 = await deliveryModel.findOne({
        delivery_update: data
    })
    res.status(200).json({
        status: 'success',
        data: data2
    })
})

exports.get_update_delivery_data = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findById(req.params.id);
    const data2 = await deliveryModel.findOne({
        delivery_update: data
    })
    res.status(200).json({
        status: 'success',
        data: data2
    })
})