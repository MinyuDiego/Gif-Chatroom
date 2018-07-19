const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const roomSchema = new Schema({
  name: String,
  participants: [{type:Schema.Types.ObjectId, ref: 'User'}],
  isPublic: {type:Boolean, default: false}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const ChatRoom = mongoose.model('ChatRoom', roomSchema);
module.exports = ChatRoom;
