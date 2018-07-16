const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");
const bcryptSalt = 10;
const ensureLogin = require("connect-ensure-login");
const passport = require("passport");
const multer = require('multer');
const upload = multer({ dest: './public/uploads/' });
const { ensureLoggedIn} = require('connect-ensure-login');

router.get('/signup', (req, res, next) => {
    res.render('passport/signup');
});

router.post('/signup', upload.single("photo"), passport.authenticate('local-signup', {
    successRedirect: '/',
    failureRedirect: '/signup',
    failureFlash: true
}));

router.get('/profile', (req, res) => {
    res.render('passport/profile', {
        user : req.user
    });
});

module.exports = router;