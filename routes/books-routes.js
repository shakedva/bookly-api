const express = require('express');
const { check } = require('express-validator');
const booksControllers = require('../controllers/books-controllers');
const router = express.Router();

router.get('/:bid', booksControllers.getBookById);

router.post('/',
    [
        check('title').not().isEmpty(),
        check('authors').not().isEmpty(),
        check('description').not().isEmpty(),
        check('pageCount').not().isEmpty(),
    ],
    booksControllers.createBook
);

router.patch('/:bid', booksControllers.updateBook);


module.exports = router;