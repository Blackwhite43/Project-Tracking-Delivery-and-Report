const deliveryModel = require('../model/deliveryModel');
const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const catchAsync = require('../utils/catchAsync');

exports.get_data_plat = catchAsync(async (req, res) => {
    const data = await deliveryModel.find({
        plat_no: req.body.plat_no
    })
    // console.log(data);
    res.status(200).json({
        status: 'success',
        total: data.length,
        data: data
    })
})

exports.update_delivery = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findByIdAndUpdate(req.params.id, req.body)
    // console.log(data);
    res.status(200).json({
        status: 'success'
    })
})