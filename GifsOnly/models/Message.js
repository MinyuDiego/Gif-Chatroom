const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

// const messageValidator = [
//   validate({
//     validator: 'isLength',
//     arguments: [0, 140],
//     message: 'Message should be between 0 and 140 characters'
//   })
// ];
const messageSchema = new Schema({
  authorId: {type:Schema.Types.ObjectId, ref: 'User'},
  roomId: {type:Schema.Types.ObjectId, ref: 'ChatRoom'},
  messageGif: {type:String, default:''},
  messageType:{type:String, default: ""},
  messageContent:{type: String},
}, {
  usePushEach: true,
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const Message = mongoose.model('Message', messageSchema);
module.exports = Message;