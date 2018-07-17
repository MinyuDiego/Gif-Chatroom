const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: "./.env.private" });
const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const User = require("../models/User");
const Message = require("../models/Message");
const Chat = require("../models/Chat");
var trending = undefined;
const axios = require("axios");
const info = axios.create({
  baseURL: "http://api.giphy.com/v1/gifs/"
});
var search = undefined;
const switchGifs = search => {
  if (!search)
    return (axiosTicket = `trending?&api_key=${process.env.APIKEY}&limit=6`);
  else
    return (axiosTicket = `search?q=${search}&api_key=${
      process.env.APIKEY
    }&limit=6`);
};

.populate({ 
  path: 'pages',
  populate: {
    path: 'components',
    model: 'Component'
  } 
})

router.get("/chatRoom", ensureLoggedIn("/login"), (req, res, next) => {
  Message.find({})
    .populate("authorId")
    .then(messages => {
      User.find({ isLoggedIn: true }).then(activeUsers => {
        info.get(switchGifs(search)).then(datos => {
          trending = datos.data.data;
          res.render("chatRoom", {
            messages,
            activeUsers,
            trending: datos.data.data
          });
        });
      });
    });
});

router.post("/chatRoom", ensureLoggedIn("/login"), (req, res, next) => {
  const { messageWow } = req.body;
  const newMessage = new Message({
    authorId: req.user._id,
    messageContent: messageWow
  });
  newMessage.save().then(() => {
    Chat.find({ isPublic: true }).then(chats => {
      chats[0].messages.unshift(newMessage._id);
      chats[0].messages.reverse();
      res.redirect("/chatRoom");
    });
  });
});

router.post("/chatRoomSearch", ensureLoggedIn("/login"), (req, res, next) => {
  search = req.body.search;
  res.redirect("/chatRoom");
});


//router.post("/chatRoom", ensureLoggedIn("/login"), (req, res, next) => {
//   const { messageWow } = req.body;
//   const newMessage = new Message({
//     authorId: req.user._id,
//     messageContent: messageWow
//   });
//   newMessage.save().then(() => {
//     Chat.find({ isPublic: true }).then(chats => {
//       chats[0].messages.unshift(newMessage._id);
//       chats[0].messages.reverse();
//       res.redirect("/chatRoom");
//     });
//   });
// });
module.exports = router;
