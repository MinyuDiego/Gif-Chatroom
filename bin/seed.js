require('dotenv').config();

const mongoose = require('mongoose');
const Chat = require('../models/ChatRoom');

const dbName = process.env.DBURL;
mongoose.connect(dbName);

const chat = 
  {
    name: "Public Chat Room",
    users:[],
    isPublic:true
  }

Chat.collection.drop();


Chat.create(chat, (err, data) => {
  if (err) { throw(err) }
  console.log(`Created ${chat}`);
  mongoose.disconnect()
});