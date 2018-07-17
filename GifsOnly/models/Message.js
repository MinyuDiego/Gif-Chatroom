const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const messageSchema = new Schema({
  authorId: {type:Schema.Types.ObjectId, ref: 'User'},
  messageGif: {type:String, default:''},
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