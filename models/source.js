const mongoose = require('mongoose');

const sourceSchema = mongoose.Schema({
  _id: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  image: String,
  link: String,
  description: String,
  type: String,
  subscriptions: { type: [{ type: String, ref: 'User' }], default: [] },
  lastPushed: { type: Date, default: Date.now },
}, {
  timestamps: true,
},
);

module.exports = mongoose.model('Source', sourceSchema);
