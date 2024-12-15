const mongoose = require('mongoose');


const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    password: { type: String, required: true },
    slug: { type: String, required: true },
    apikey: { type: String, required: true },
    token: { type: String, required: true },
    email: { type: String, required: true },
    verified: Boolean
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;