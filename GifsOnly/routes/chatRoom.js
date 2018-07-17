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
      //console.log(res.data.data)
      Message.find({})
      .populate("authorId")
      .then(messages => {
        User.find({ isLoggedIn: true }).then(activeUsers => {
            res.render("chatRoom", { messages, activeUsers, trending: datos.data.data});
        });
      });
    })
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

/* router.get('/chatRoomSearch',  ensureLoggedIn("/login"), (req, res, next) =>{
  res.redirect('/chatRoom');
}) */

router.post("/chatRoomSearch", ensureLoggedIn("/login"), (req, res, next) => {
  const search = req.body.search;
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
    })})})
    .catch(err => console.log(err));
});

router.post("/chatRoomGifMessage", ensureLoggedIn("/login"), (req, res, next) => {
  const selectedGif = req.body.imgSrc;
  let newGifMessage={
    authorId:req.user,
    messageGif:selectedGif,
    messageContent: ''
  }
  Message.insertMany(newGifMessage, function(err, res) {
    if (err) throw err;
    console.log("1 document inserted");
});
});

router.get("/deleteMessage/:id", ensureLoggedIn(), (req, res) => {
  Message.findByIdAndRemove(req.params.id, () => res.redirect("/chatRoom"));
});

module.exports = router;
