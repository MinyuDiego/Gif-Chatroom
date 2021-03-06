const dotenv = require("dotenv");
dotenv.config();
dotenv.config({ path: './.env.private' });
const express = require("express");
const passport = require("passport");
const authRoutes = express.Router();
const User = require("../models/User");
const multer = require("multer");
const upload = multer({ dest: "./public/uploads/" });
const { ensureLoggedIn, ensureLoggedOut } = require("connect-ensure-login");
const axios = require("axios");
const Chat  = require('../models/ChatRoom');

// Bcrypt to encrypt passwords
const bcrypt = require("bcrypt");
const bcryptSalt = 10;

authRoutes.get("/login", ensureLoggedOut('/profile'), (req, res, next) => {
  res.render("auth/login", { message: req.flash("error") });
});

authRoutes.post(
  "/login",
  ensureLoggedOut(),
  passport.authenticate("local", {
    successRedirect: "/profile",
    failureRedirect: "/login",
    failureFlash: true,
    passReqToCallback: true
  })
);

authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

authRoutes.post("/signup", upload.single("photo"), (req, res, next) => {
  const { username, password, email, color } = req.body;
  if (username === "" || password === "") {
    res.render("auth/signup", { message: "Indicate username and password" });
    return;
  }

  User.findOne({ username }, "username", (err, user) => {
    if (user !== null) {
      res.render("auth/signup", { message: "The username already exists" });
      return;
    }

    const salt = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashPass,
      color,
      profileGif: req.file ? req.file.filename : ""
    });

    newUser.save(err => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  });
});

authRoutes.get("/logout", (req, res) => {
  const id = req.user._id;
  User.findByIdAndUpdate(req.user._id, {isLoggedIn: false}, {new:true})
  .then((user) => {
    Chat.find({isPublic: true})
    .then(chats =>{
      chats.forEach(function(e){
        e.participants.splice(e.participants.indexOf(user._id),1)
      })
       chats.forEach(function(e){
         e.save()
       })
    })
    req.logout();
    res.redirect("/");})
  
});

authRoutes.get("/profile", ensureLoggedIn("/login"), (req, res, next) => {
  Chat.find({ participants: { $in: [ req.user._id ]} } )
  .then(chats => {
    res.render("profile",{chats});
  })
    
});

authRoutes.post("/profile", ensureLoggedIn("/login"), (req, res, next) => {
  const search = req.body.search;
  const info = axios.create({
    baseURL: "http://api.giphy.com/v1/gifs/"
  });
  const axiosTicket = `search?q=${search}&api_key=${
    process.env.APIKEY
    }&limit=54`;
  info
    .get(`${axiosTicket}`)
    .then(datos => {
      Chat.find({ participants: { $in: [ req.user._id ]} } )
      .then(chats => {
        console.log(chats)
        res.render("profile", { wow: datos.data.data , chats});
      })
      
    })
    .catch(err => console.log(err));
});

authRoutes.post("/profileWow", ensureLoggedIn("/login"), (req, res, next) => {
  const info = axios.create({
    baseURL: "http://api.giphy.com/v1/gifs/"
  });
  const axiosTicket = `trending?&api_key=${
    process.env.APIKEY
    }&limit=54`;
  info
    .get(`${axiosTicket}`)
    .then(datos => {
      Chat.find({ participants: { $in: [ req.user._id ]} } )
      .then(chats => {
        console.log(chats)
        res.render("profile", { wow: datos.data.data , chats});
      })
    })
    .catch(err => console.log(err));
});

authRoutes.post("/moodWow", ensureLoggedIn("/login"), (req, res, next) => {
  const moodPic = req.body.imgSrc;
  User.findByIdAndUpdate(req.user._id, { moodPic }, { new: true }).then(user => {
    console.log('modificado')
  })
});

module.exports = authRoutes;
