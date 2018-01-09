const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MeteringPointSchema = new Schema({
        owner: String,
        address: String
    }, {collection: "MeteringPoint"}
);


MeteringPointSchema
    .virtual('url')
    .get(function () {
        return '/dashboard/' + this._id;
    });


module.exports = mongoose.model('MeteringPoint', MeteringPointSchema);