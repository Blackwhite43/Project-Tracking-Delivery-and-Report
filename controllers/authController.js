const { promisify } = require('util');
const AppError = require('../utils/appError');
const jwt = require('jsonwebtoken');
const catchAsync = require('../utils/catchAsync');
const deliveryModel = require('../model/deliveryModel')
const signToken = (id) =>
    // jwt.sign(payload, secretOrPrivateKey, [options, callback])
    // Payload contains the claims. Claims are statements about an entity (typically, the user) and additional data. {id}: Only want entity of user Id
    // JWT_SECRET: The algorithm ( HS256 ) used to sign the JWT means that the secret is a symmetric key that is known by both the sender and the receiver. It is negotiated and distributed out of band. Hence, if you're the intended recipient of the token, the sender should have provided you with the secret out of band.
    // JWT_EXPIRES_IN: For logging out a user after a certain period of time. Treated as milliseconds.
    jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
    });
    const createSendToken = (user, statusCode, res) => {
        const token = signToken(user._id);
        const cookieOptions = {
            expires: new Date(
                Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
            ),
            httpOnly: true, // cookie cant be accessed or modified in any way by the browser prevent cross-site scripting attacks
        };

    if (process.env.NODE_ENV === 'production') cookieOptions.secure = true; // will set secure to true if in the production environment
    // SEND COOKIE
    // res.cookie("name-of-cookie", data-wanna-send, options-of-cookie)
    res.cookie('jwt', token, cookieOptions);
    // remove password from output
    user.password = undefined;

    res.status(statusCode).json({
        status: 'success',
        // JWT.SIGN here we send token to client
        token,
        data: {
            user,
        },
    });
};

exports.login = catchAsync(async (req, res, next) => {
    // because the variable name and the name from req.body its same we can destructuring object
    const { email, password } = req.body;
    // 1) Check if email and pass exist
    if (!email || !password) {
        return next(new AppError('Please provide email and password!', 400));
    }
    // 2) Check if the user exists && password is correct
    const user = await User.findOne({ email: email }).select('+password'); // select using + bcs the select is false before
  
    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new AppError('Incorrect email or password!', 401));
    }
    // console.log(user);
    // 3) If everything ok, send token to client
    createSendToken(user, 200, res);
});

exports.logout = (req, res) => {
    res.cookie('jwt', 'loggedout', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
};

exports.isLoggedIn = async (req, res, next) => {
    if (req.cookies.jwt) {
        try {
            // 1) verify token
            const decoded = await promisify(jwt.verify)(req.cookies.jwt, process.env.JWT_SECRET);
            // 2) Check if user still exists
            const currentUser = await User.findById(decoded.id);
            if (!currentUser) {
                return next();
            }
            // 3) Check if user changed password after the token was issued
            if (currentUser.changedPasswordAfter(decoded.iat)) {
                return next();
            }
            // THERE IS A LOGGED IN USER
            res.locals.user = currentUser;
            return next();
        } catch (err) {
            return next();
        }
    }
    next();
};

exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting to token and check if it's there
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    else if (req.cookies.jwt) {
        token = req.cookies.jwt
    }
    // console.log(token);
    if (!token) {
        return next(new AppError('You are not loggged in! Please logged in to get access.', 401));
    }
    // 2) Verification token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    //console.log(decoded);
    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(new AppError('The user belonging to this token does no longer exist.'));
    }
    // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});