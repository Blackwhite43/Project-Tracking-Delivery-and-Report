const deliveryModel = require('../model/deliveryModel');
const deliveryUpdateModel = require('../model/deliveryUpdateModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const moment = require('moment/moment');
const multer = require("multer");
const driveAuth = require("../Google_Drive/DriveService");
const Stream = require('stream');
const { google } = require('googleapis');
const fs = require('fs');

function get_date() {
    var arr = [];
    var dateStart = new Date();
    var dateEnd = new Date();
    dateStart.setHours(0,0,0,0);
    dateEnd.setHours(23,59,59,0);
    arr[0] = dateStart;
    arr[1] = dateEnd;
    return arr;
}

const uploadFile = async (file) => {
    const folderId = ["1G4oRLYkr0r4L1DuQqBumOiVSWEggRdTq"];
    const bufferStream = fs.createReadStream(file.path);
    const auth = driveAuth.getDriveService();
    const { data } = await google.drive({version: "v3", auth}).files.create({
        resource: {
            name: file.filename,
            parents: folderId
        },
        media: {
            mimeType: file.mimetype,
            body: bufferStream
        },
        fields: "id, name"
    })
    // console.log(data);
}

const multerStorage = multer.diskStorage({
    // destination: (req, file, cb) => {
    //     cb(null, './img');
    // },
    filename: async (req, file, cb) => {
        const data = await deliveryUpdateModel.findById(req.params.id);
        const data2 = await deliveryModel.findOne({
            delivery_update: data
        })
        const plat_no = data2.plat_no.split(" ");
        const ext = file.mimetype.split('/')[1];
        const time = moment().format("DD:MM:YYYY:HH:mm:ss").split(":");
        const name = `update-${plat_no[0]}_${plat_no[1]}_${plat_no[2]}-${time[0]}_${time[1]}_${time[2]}-${time[3]}_${time[4]}_${time[5]}.${ext}`;
        cb(null, name)
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

exports.saveMedia = async (req, res, next) => {
    if (!req.file) {
        return next();
    }
    else {
        await uploadFile(req.file);
        req.body.photo = req.file.filename;
        next();
    }
}

exports.get_data_plat = catchAsync(async (req, res) => {
    var dateStart = get_date()[0];
    var dateEnd = get_date()[1];
    const data = await deliveryModel.find({
        plat_no: req.body.plat_no.toUpperCase(),
        $and: [
            {tanggal:{$gte: dateStart}},
            {tanggal:{$lte: dateEnd}}
        ]
    })
    res.status(200).json({
        status: 'success',
        total: data.length,
        data: data
    })
})

exports.get_data_plat_home = catchAsync(async (req, res) => {
    var dateStart = get_date()[0];
    var dateEnd = get_date()[1];
    const data = await deliveryUpdateModel.find({
        status_delivery: {$eq: "Ready for Delivery"}
    });
    const data2 = await deliveryModel.find({
        plat_no: req.body.plat_no.toUpperCase(),
        delivery_update: data, 
        $and: [
            {tanggal:{$gte: dateStart}},
            {tanggal:{$lte: dateEnd}}
        ]
    })
    res.status(200).json({
        status: 'success',
        total: data2.length,
        data: data2
    })
})

exports.update_delivery = catchAsync(async (req, res) => {
    const data = await deliveryUpdateModel.findByIdAndUpdate(req.params.id, {
        $set: {
            status_delivery: req.body.status_delivery,
            photo: req.body.photo,
            reason: req.body.reason
        }
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
    var dateStart = get_date()[0];
    var dateEnd = get_date()[1];
    const data = await deliveryModel.aggregate([
        {
            '$match': {
                plat_no: req.body.plat_no.toUpperCase(),
                $and: [
                    {tanggal:{$gte: dateStart}},
                    {tanggal:{$lte: dateEnd}}
                ]
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