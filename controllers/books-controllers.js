const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Book = require('../models/book');
const HttpStatusCodes = require('../utils/httpStatusCodes');

const getBookById = (req, res) => {
    const bookId = req.params.bid;
    res.json({ bookId: bookId });
};


const createBook = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs', HttpStatusCodes.UNPROCESSABLE_ENTITY));
    }
    const { title, authors, description, pageCount, isbn, image, review, quotes, notes, characters } = req.body;
    const createdBook = new Book({
        title, authors, description, pageCount, isbn, image, review, quotes, notes, characters
    });
    console.log(createdBook)
    try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdBook.save({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new HttpError('Could not save book', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    res.status(201).json({ createdBook });
};


exports.getBookById = getBookById;
exports.createBook = createBook;