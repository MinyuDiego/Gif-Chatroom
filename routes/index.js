const express = require('express');
const router = express.Router();
const { ensureLoggedIn } = require("connect-ensure-login");
const User = require("../models/User");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get('/userhomepage', ensureLoggedIn("/login"), (req, res, next) => {
  User.find({}).select({ "profileGif": 1, "_id": 0 })
    .then(results => {
      console.log(results);
      res.render("userhomepage", { results });
    })
    .catch(err => {
      next(err);
    });
})


module.exports = router;
