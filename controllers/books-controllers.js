const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const Book = require('../models/book');
const HttpStatusCodes = require('../utils/httpStatusCodes');
const HttpError = require('../models/http-error');

const getBookById = async (req, res, next) => {
    const bookId = req.params.bid;
    let book;
    try {
        book = await Book.findById(bookId);
    } catch (err) {
        return next(new HttpError('Could not find book', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    if (!book) {
        return next(new HttpError('Could not find book for the provided id', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    res.json({ book: book.toObject({ getters: true }) });
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
    res.status(HttpStatusCodes.CREATED).json({ createdBook });
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

    const { pageCount, description } = req.body;
    if (pageCount) book.pageCount = pageCount;
    if (description) book.description = description;

    try {
        await book.save();
    } catch (err) {
        return next(new HttpError('Could not edit the book', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    res.status(HttpStatusCodes.OK).json({ book: book.toObject({ getters: true }) });
};

const deleteBook = async (req, res, next) => {
    const bookId = req.params.bid;
    let book;
    try {
        book = await Book.findById(bookId);
        if(!book) {
            return next(new HttpError('Could find the book for the provided id', HttpStatusCodes.INTERNAL_SERVER_ERROR));
        }
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await book.deleteOne({ session: sess });
        await sess.commitTransaction();
    } catch (err) {
        return next(new HttpError('Could delete the book', HttpStatusCodes.INTERNAL_SERVER_ERROR));
    }
    res.status(HttpStatusCodes.OK).json({ message: "Deleted book" });
};

exports.getBookById = getBookById;
exports.createBook = createBook;
exports.updateBook = updateBook;
exports.deleteBook = deleteBook;