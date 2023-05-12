const deliveryModel = require('../model/deliveryModel');
const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const catchAsync = require('../utils/catchAsync');
exports.update_verification = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findByIdAndUpdate(req.params.id, {
        verification: req.body.verification
    });
    const data2 = await deliveryModel.findOne({
        delivery_update: data
    })
    res.status(200).json({
        status: 'success',
        data: data2
    })
})