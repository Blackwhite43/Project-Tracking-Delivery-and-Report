const multer = require('multer');
const deliveryModel = require('../model/deliveryModel');
const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './img');
    },
    filename: (req, file, cb) => {
        const ext = file.mimetype.split('/')[1];
        cb(null, `update-${req.params.id}-${Date.now()}.${ext}`)
    }
})

const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    }
    else {
        cb(new AppError('File is not image or video! Please upload only specified files.', 400), false);
    }
}

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter
})

exports.uploadProblemsMedia = upload.single('photo');

exports.saveMedia = (req, res, next) => {
    if (!req.file) {
        return next();
    }
    else {
        req.body.photo = req.file.filename
        next();
    }
}

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
    // const temp_plat = window.localStorage.setItem("plat_no", req.body.plat_no);
    res.status(200).json({
        status: 'success',
        total: data2.length,
        data: data2
    })
})

exports.update_delivery = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findByIdAndUpdate(req.params.id, {
        status_delivery: req.body.status_delivery,
        photo: req.body.photo
    });
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

exports.get_stats = catchAsync(async (req, res) => {
    const data = await deliveryModel.aggregate([
        {
            '$match': {
                plat_no: req.body.plat_no
            }
        },
        {
            '$lookup': {
                'from': 'deliveryupdates', 
                'localField': 'delivery_update', 
                'foreignField': '_id', 
                'as': 'lastStatus'
            }
        },
        {
            '$addFields': {
                'status': {
                    '$first': '$lastStatus.status_delivery'
                }
            }
        },
        {
            '$group': {
                '_id': {
                    plat_no: '$plat_no',
                    driver: "$driver",
                    kenek: "$kenek",
                }, 
                'delivered': {
                    '$sum': {
                        '$cond': [{'$eq': ['$status', 'Delivered']}, 1, 0]
                    }
                },
                'ready_for_delivery': {
                    '$sum': {
                        '$cond': [{'$eq': ['$status', 'Ready for Delivery']}, 1, 0]
                    }
                },
                'out_for_delivery': {
                    '$sum': {
                        '$cond': [{'$eq': ['$status', 'Out for Delivery']}, 1, 0]
                    }
                },
                'not_delivered': {
                    '$sum': {
                        '$cond': [{'$eq': ['$status', 'Not Delivered']}, 1, 0]
                    }
                }
            }
        }
    ])
    // console.log(data);
    res.status(200).json({
        status: 'success',
        total: data.length,
        data: data
    })
})