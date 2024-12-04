const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({
    name: { type: String, required: true }
  });
const LemonSchema = new mongoose.Schema({
  name: { type: String, required: true},
  channels: [ChannelSchema]
});

const Users = mongoose.model('Lemons', LemonSchema);

module.exports = Users;