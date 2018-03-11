'use strict';

var passport = require('passport'),
  LocalStrategy = require('passport-local').Strategy,
  TwitterTokenStrategy = require('passport-twitter-token'),
  GoogleTokenStrategy = require('passport-google-token').Strategy,
  User = require('mongoose').model('User'),
  Config = require('./config.js');

module.exports = function () {
    
// LOCAL LOGIN ============================================================
// ========================================================================= 
  passport.use('local-login', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true}, function (req, username, password, done) {
  User.locateLocalUser(req, username, password, function(err, user) {
        return done(err, user);
   });}));                                 
                    
// LOCAL SIGNUP ============================================================
// =========================================================================  
  passport.use('local-signup', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  session: false,
  passReqToCallback: true}, function (req, username, password, done) {
  User.upsertLocalUser(req, username, password, function(err, user) {
        return done(err, user);
   });}));          
    
// TWITTER SIGNUP/LOGIN ============================================================
// ========================================================================= 
  passport.use(new TwitterTokenStrategy({
      consumerKey: Config.consumerKey,
      consumerSecret: Config.consumerSecret,
      passReqToCallback: true
    },
    function (req, token, tokenSecret, profile, done) {
      User.upsertTwitterUser(req, token, tokenSecret, profile, function(err, user, newStatus) {
        return done(err, user, newStatus);
      });
    }));

//GOOGLE SIGNUP/LOGIN ============================================================
// =========================================================================
 passport.use(new GoogleTokenStrategy({
    clientID: Config.clientID,
    clientSecret: Config.clientSecret,
    passReqToCallback: true},
    function (req, accessToken, refreshToken, profile, done) {
    User.upsertGoogleUser(req, accessToken, refreshToken, profile, function(err, user, newStatus) {
    return done(err, user, newStatus);
      });
    }));   

};
