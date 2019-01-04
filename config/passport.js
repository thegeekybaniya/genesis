const LocalStrategy = require('passport-local').Strategy;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Load User model
const User = require('../models/user');
// var FacebookStrategy = require('passport-facebook').Strategy;


module.exports = function(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(user => {
        if (!user) {
          return done(null, false, { message: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });


    // passport.use(new FacebookStrategy({
    //         clientID: '393046504764290',
    //         clientSecret: '57917db62742a905848d849ac48f86ea',
    //         callbackURL: "localhost:5000/dashboard"
    //     },
    //     function(accessToken, refreshToken, profile, done) {
    //         User.findOrCreate(..., function(err, user) {
    //             if (err) { return done(err); }
    //             done(null, user);
    //         });
    //     }
    // ));
};
