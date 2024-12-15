const mongoose = require('mongoose');


const VerificationSchema = new mongoose.Schema({
verifies: String,
code: String
});

const Verify = mongoose.model('Verify', VerificationSchema);

module.exports = Verify;