const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: "./.env.private" });
const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const User = require("../models/User");
const Message = require("../models/Message");
const axios = require("axios");
const Chat = require("../models/ChatRoom");
var idChat = undefined;

router.get("/chatRoom/:id", ensureLoggedIn("/login"), (req, res, next) => {
  idChat = req.params.id;
  const search = req.user.latestGifSearch;
  if (!search) {
    const info = axios.create({
      baseURL: "http://api.giphy.com/v1/gifs/"
    });

    const axiosTicket = `trending?&api_key=${process.env.APIKEY}&limit=10`;
    info.get(`${axiosTicket}`).then(datos => {
      Message.find({ roomId: { $in: [req.params.id] } })
        .populate("authorId")
        .then(messages => {
          Chat.findById(req.params.id)
            .populate("participants")
            .then(chat => {
              res.render("chatRoom", {
                chat,
                messages,
                activeUsers: chat.participants,
                trending: datos.data.data
              });
            });
        });
    });
  } else {
    const info1 = axios.create({
      baseURL: "http://api.giphy.com/v1/gifs/"
    });
    const axiosTicket1 = `search?q=${search}&api_key=${
      process.env.APIKEY
    }&limit=10`;
    info1.get(`${axiosTicket1}`).then(datos => {
      Message.find({ roomId: { $in: [req.params.id] } })
        .populate("authorId")
        .then(messages => {
          Chat.findById(req.params.id)
            .populate("participants")
            .then(chat => {
              res.render("chatRoom", {
                chat,
                messages,
                activeUsers: chat.participants,
                searchResult: datos.data.data
              });
            });
        });
    });
  }
});

router.post("/chatRoom", ensureLoggedIn("/login"), (req, res, next) => {
  const { textSent, search } = req.body;
  if (!search ) {
    const newMessage = new Message({
      authorId: req.user._id,
      roomId: idChat,
      messageContent: textSent,
      messageType: "public"
    });
    newMessage.save().then(() => {
      console.log("message saved");
    });
  } else {
    User.findByIdAndUpdate(
      req.user._id,
      { latestGifSearch: search },
      { new: true }
    ).then(user => {
      console.log("gif search saved");
    });
  }
});

router.post("/chatRoomInterval", ensureLoggedIn("/login"), (req, res, next) => {
  Message.find({ roomId: { $in: [req.body.chatId] } })
    .populate("authorId")
    .then(messages => {
      res.json({ messages });
    })
    .catch(err => console.log(err))
});

router.post(
  "/chatRoomGifMessage",
  ensureLoggedIn("/login"),
  (req, res, next) => {
    const selectedGif = req.body.imgSrc;
    let newGifMessage = {
      authorId: req.user,
      roomId: idChat,
      messageGif: selectedGif,
      messageContent: "",
      messageType: "public"
    };

    Message.insertMany(newGifMessage).then(() => {
      console.log("gif message added to data base");
    });
  }
);

router.get("/chatRoom/deleteMessage/:id", ensureLoggedIn(), (req, res) => {
  Message.findById(req.params.id).then(result => {
    if (JSON.stringify(req.user._id) == JSON.stringify(result.authorId)) {
      Message.findByIdAndRemove(req.params.id).then(() => {
        console.log("removed");
        res.redirect(`/chatRoom/${idChat}`);
      });
    } else {
      console.log("cannot delete message not created by you");
      res.redirect(`/chatRoom/${idChat}`);
    }
  });
});

router.get("/createChatRoom", ensureLoggedIn(), (req, res) => {
  User.find().then(users => {
    res.render("newChatRoom", { users });
  });
});

router.post("/createChatRoom", ensureLoggedIn("/login"), (req, res, next) => {
  const name = req.body.name;
  const participants = req.body.participants;
  if(!participants.includes(req.user._id)) participants.push(req.user._id)
  let newChatRoom = {
    name,
    participants: participants.slice()
  };
  Chat.insertMany(newChatRoom).then(() => {
    console.log("New chat");
    res.redirect("/profile");
  });
});

router.get("/delete/:id", (req, res) => {
  Chat.findById(req.params.id).then(chat => {
    if (chat.isPublic == true) res.redirect("/profile");
    else Chat.findByIdAndRemove(req.params.id, () => res.redirect("/profile"));
  });
});
module.exports = router;
