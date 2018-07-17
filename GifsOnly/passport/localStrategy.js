const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User          = require('../models/User');
const Chat         = require('../models/Chat');
const bcrypt        = require('bcrypt');

passport.use(new LocalStrategy((username, password, next) => {
  User.findOne({ username }, (err, foundUser) => {
    if (err) {
      next(err);
      return;
    }

    if (!foundUser) {
      next(null, false, { message: 'Incorrect username' });
      return;
    }

    if (!bcrypt.compareSync(password, foundUser.password)) {
      next(null, false, { message: 'Incorrect password' });
      return;
    }

    foundUser.isLoggedIn = true;
    Chat.find({isPublic: true})
    .then(chats =>{
      chats.forEach(function(e){
        e.users.unshift(foundUser._id)
      })
       foundUser.save()
       .then(()=>chats.forEach(function(e){
         e.save()
       }))
    })
    
    next(null, foundUser);
  });
}));
