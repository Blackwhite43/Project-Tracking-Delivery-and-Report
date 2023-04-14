const deliveryModel = require('../model/deliveryModel');
const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');

exports.get_alldata = factory.getAll(deliveryModel);
exports.get_data = factory.getOne(deliveryModel);
exports.update_data = factory.updateOne(deliveryModel);

exports.create_delivery_data = catchAsync(async (req, res) => {
    var dateStart = new Date();
    var dateEnd = new Date();
    // dateStart.setDate(dateStart.getDate()-1);
    dateStart.setHours(0,0,0,0);
    dateEnd.setHours(23,59,59,0);
    await deliveryModel.deleteMany({
        $and: [
            {created_at:{$gte: dateStart}},
            {created_at:{$lte: dateEnd}}
        ]
    });
    await deliveryUpdateModel.deleteMany({
        $and: [
            {created_at:{$gte: dateStart}},
            {created_at:{$lte: dateEnd}}
        ]
    });
    await deliveryModel.create(req.body);
    res.status(201).json({
        status: 'success'
    })
})

exports.delete_data = catchAsync(async (req, res, next) => {
    const doc = await deliveryModel.findByIdAndDelete(req.params.id);
    const doc2 = await deliveryUpdateModel.findByIdAndDelete(doc.delivery_update);
    if (!doc && !doc2) {
        return next(new AppError('No document found with that ID', 404));
    }
    res.status(204).json({
        status: 'success'
    })
})

exports.delete_Alldata = catchAsync(async (req, res) => {
    await deliveryModel.deleteMany();
    await deliveryUpdateModel.deleteMany();
    res.status(204).json({
        status: 'success'
    })
})