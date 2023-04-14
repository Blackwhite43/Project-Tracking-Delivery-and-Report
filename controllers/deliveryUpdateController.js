const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const factory = require('./handlerFactory');

exports.get_alldata = factory.getAll(deliveryUpdateModel);
exports.get_data = factory.getOne(deliveryUpdateModel);
exports.update_data = factory.updateOne(deliveryUpdateModel);