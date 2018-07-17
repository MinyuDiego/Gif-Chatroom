const express = require("express");
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const User = require("../models/User");
const Message = require("../models/Message");
var trending = undefined;
const axios = require("axios")


router.get("/chatRoom", ensureLoggedIn("/login"), (req, res, next) => {
  Message.find({})
      .populate("authorId")
      .then(messages => {
        User.find({ isLoggedIn: true }).then(activeUsers => {
            res.render("chatRoom", { messages, activeUsers});
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
    res.redirect('/chatRoom')
  });
});

router.get("/chatRoomTrending", ensureLoggedIn("/login"), (req, res, next) => {
  const info = axios.create({
    baseURL: "http://api.giphy.com/v1/gifs/"
  });
  const axiosTicket = `trending?&api_key=${
    process.env.APIKEY
  }&limit=5`;
  info
    .get(`${axiosTicket}`)
    .then(datos => {
      //console.log(res.data.data)
      trending = datos.data.data;
      res.redirect("/chatRoom")
    })
    .catch(err => console.log(err));
});

module.exports = router;
