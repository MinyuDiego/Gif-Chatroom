const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
  authorId: {type:Schema.Types.ObjectId, ref: 'User'},
  roomId: {type:Schema.Types.ObjectId, ref: 'ChatRoom'},
  messageGif: {type:String, default:''},
  messageType:{type:String, default: ""},
  messageContent:{type: String},
  messageType: {type:String, default:''},
  //roomId: {type:Schema.Types.ObjectId, ref: 'ChatRoom'}
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;