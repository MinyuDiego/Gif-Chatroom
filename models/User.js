const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: String,
  password: String,
  email: String,
  isLoggedIn: { type: Boolean, default: false },
  profileGif: { type: String, required: true },
  moodPic: { type: String, default: '' },
  color: {type: String},
  latestGifSearch: String
}, {
    usePushEach: true,
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  });

const User = mongoose.model('User', userSchema);
module.exports = User;
