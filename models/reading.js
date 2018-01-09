const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const ReadingSchema = new Schema({
    consumption: {type: Number, required: true},
    meteringpoint: {type: Schema.ObjectId, ref: 'MeteringPoint', required: true},
}, {timestamps: true, collection: "Reading"});




module.exports = mongoose.model('Reading', ReadingSchema);