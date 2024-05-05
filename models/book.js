const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title: { type: String, required: true },
    authors: [{ type: String, required: true }],
    description: { type: String, required: true },
    isbn: { type: String },
    pageCount: { type: Number, required: true, min: 0},
    image: { type: String }, //TODO required: true
    review: { type: String },
    quotes: [{ type: String }],
    notes: [{ type: String }],
    characters: [{ type: String }], // TODO  array of JSONs
    // creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Book', bookSchema);