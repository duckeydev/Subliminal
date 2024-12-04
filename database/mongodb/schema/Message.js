const mongoose = require('mongoose');
const React = new mongoose.Schema({
    from: { type: String, required: true },
    emoji: { type: String, required: true }
  });
const MessageSchema = new mongoose.Schema({
  message: { type: String, required: false },
  from: { type: String, required: true },
  reacts: [React]
});

const Messages = mongoose.model('Messages', MessageSchema);

module.exports = Messages;