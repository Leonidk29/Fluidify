const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const localMongoose = require('passport-local-mongoose');

const AccountSchema = new Schema({
    username: String,
    password: String
});

AccountSchema.plugin(localMongoose);


module.exports = mongoose.model('Account', AccountSchema);