const { validationResult } = require('express-validator');
const HttpStatusCodes = require('../utils/httpStatusCodes');
const HttpError = require('../models/http-error');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const SALT_ROUNDS = 12;

//TODO: JWT Authentication

const signup = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs passed', HttpStatusCodes.UNPROCESSABLE_ENTITY));
    }
    const { name, email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Signing up failed', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    if (user) {
        return next(new HttpError('User exists already, please login instead.', HttpStatusCodes.UNPROCESSABLE_ENTITY));
    }
    let hashedPassword;
    try {
        hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    } catch (err) {
        return next(new HttpError('Could not create user.', 500));
    }
    const createdUser = new User({
        name,
        email,
        password: hashedPassword,
        books: []
    });
    try {
        await createdUser.save();
    } catch (err) {
        const error = new HttpError('Signing up failed.', 500);
        return next(error)
    }
    // TODO attach jwt token to the response
    res.status(HttpStatusCodes.CREATED).json({ userId: createdUser.id, email: createdUser.email });
};
const login = async (req, res, next) => {
    const { email, password } = req.body;
    let user;
    try {
        user = await User.findOne({ email: email })
    } catch (err) {
        return next(new HttpError('Logging in failed', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    if (!user) { // User does not exists
        return next(new HttpError('Invalid credentials', HttpStatusCodes.FORBIDDEN));
    }
    let isValidPassword = false;
    try {
        isValidPassword = await bcrypt.compare(password, user.password);
    } catch (err) {
        return next(new HttpError('Could not log you in', 500));
    }
    if (!isValidPassword) { // Incorrect password
        return next(new HttpError('Invalid credentials', 500));
    }
    // TODO check jwt token in the request

    res.json({ userId: user.id, email: user.email });
};

exports.signup = signup;
exports.login = login;