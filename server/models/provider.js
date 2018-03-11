var mongoose = require('mongoose');

var providerSchema = mongoose.Schema({
  username: String,
  date: { type: Date, default: Date.now },
  bookid: String,
  title: String,
  thumbnail: String,
  link: String,
  status: String,
  receiver: String
});

module.exports = mongoose.model('Provider', providerSchema);