const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    description: { type: String, required: true },
    isbn: { type: String },
    pageCount: { type: Number, required: true, min: 0 },
    image: { type: String }, //TODO required: true
    creator: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Book', bookSchema);