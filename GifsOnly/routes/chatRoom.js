const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const User = require("../models/User");
const Message = require("../models/Message");
const axios = require("axios")


router.get("/chatRoom", ensureLoggedIn("/login"), (req, res, next) => {
  const info = axios.create({
    baseURL: "http://api.giphy.com/v1/gifs/"
  });
  const axiosTicket = `trending?&api_key=${
    process.env.APIKEY
    }&limit=3`;
  info
    .get(`${axiosTicket}`)
    .then(datos => {
      Message.find({})
        .populate("authorId")
        .then(messages => {
          User.find({ isLoggedIn: true }).then(activeUsers => {
            res.render("chatRoom", { messages, activeUsers, trending: datos.data.data });
          });
        });
    })
});

router.post("/chatRoom", ensureLoggedIn("/login"), (req, res, next) => {
  const { textSent, search } = req.body;
  console.log(search);
  const newMessage = new Message({
    authorId: req.user._id,
    messageContent: textSent,
    messageType: 'public'
  });
  newMessage.save().then(() => {
    console.log('message saved');
  });
  const info = axios.create({
    baseURL: "http://api.giphy.com/v1/gifs/"
  });
  const axiosTicket = `search?q=${search}&api_key=${
    process.env.APIKEY
    }&limit=3`;
  info
    .get(`${axiosTicket}`)
    .then(datos => {
      Message.find({})
        .populate("authorId")
        .then(messages => {
          User.find({ isLoggedIn: true }).then(activeUsers => {
            res.render("chatRoom", { messages, activeUsers, searchResult: datos.data.data });
          })
        })
    })
    .catch(err => console.log(err));
});

router.post("/chatRoomGifMessage", ensureLoggedIn("/login"), (req, res, next) => {
  const selectedGif = req.body.imgSrc;
  let newGifMessage = {
    authorId: req.user,
    messageGif: selectedGif,
    messageContent: '',
    messageType: 'public'
  }

  Message.insertMany(newGifMessage).then(() => {
    console.log('gif message added to data base')
  })
});

router.get("/chatRoom/deleteMessage/:id", ensureLoggedIn(), (req, res) => {
  Message.findById(req.params.id)
    .then(result => {
      if (JSON.stringify(req.user._id) == JSON.stringify(result.authorId)) {
        Message.findByIdAndRemove(req.params.id)
          .then(() => {
            console.log('removed')
            res.redirect("/chatRoom");
          })
      } else {
        console.log('cannot delete message not created by you')
        res.redirect('/chatRoom');
      }
    })
});

module.exports = router;
