const mongoose = require('mongoose');


const userSchema = mongoose.Schema({
  _id: String,
  pushToken: [String],
}, {
  timestamps: false,
},
);

userSchema.virtual('uid').get(function () {
  return this._id;
});

// userSchema.index({ uid: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);
