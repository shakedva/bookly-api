const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Book = require('../models/book');
const HttpStatusCodes = require('../utils/httpStatusCodes');
const HttpError = require('../models/http-error');

const getBookById = (req, res) => {
    const bookId = req.params.bid;
    res.json({ bookId: bookId });
};


const createBook = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs', HttpStatusCodes.UNPROCESSABLE_ENTITY));
    }
    const { title, authors, description, pageCount, isbn, image } = req.body;
    const createdBook = new Book({
        title, authors, description, pageCount, isbn, image
    });
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

const updateBook = async (req, res, next) => {
    const bookId = req.params.bid;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return next(new HttpError('Invalid inputs', HttpStatusCodes.UNPROCESSABLE_ENTITY));
    }
    let book;
    try {
        book = await Book.findById(bookId);
    } catch (err) {
        return next(new HttpError('Could not find the book', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    // TODO check if the user can update the book

    const { pageCount, description, review } = req.body;
    if (pageCount) book.pageCount = pageCount;
    if (description) book.description = description;
    if (review) book.review = review;

    try {
        await book.save();
    } catch (err) {
        return next(new HttpError('Could not edit the book', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    res.status(200).json({ book: book.toObject({ getters: true }) });
};

exports.getBookById = getBookById;
exports.createBook = createBook;
exports.updateBook = updateBook;