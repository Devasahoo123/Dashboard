const mongoose = require('mongoose');

const SavedFeedSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemId: { type: String, required: true },
  source: { type: String, required: true, enum: ['twitter', 'reddit'] },
  title: { type: String, required: true },
  url: { type: String, required: true },
  savedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SavedFeed', SavedFeedSchema);