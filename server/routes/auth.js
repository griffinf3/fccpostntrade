var express = require('express');
var validator = require('validator');
var passport = require('passport');
var User = require('mongoose').model('User');
var bcrypt = require('bcrypt-nodejs');
var router = new express.Router();

/**
 * Validate the sign up form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 * errors tips, and a global message for the whole form.
 */

function validateSignupForm(payload) {
  var errors = {};
  let isFormValid = true;
  let message = '';
   
  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false;
    errors.name = 'Please provide your name.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the password form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */

function validatePasswordForm(payload) {
  var errors = {};
  let isFormValid = true;
  let message = '';
   
  if (!payload || typeof payload.oldpassword !== 'string' || payload.oldpassword.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!payload || typeof payload.newpassword !== 'string' || payload.newpassword.trim().length < 8) {
    isFormValid = false;
    errors.password = 'Password must have at least 8 characters.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

/**
 * Validate the login form
 *
 * @param {object} payload - the HTTP body message
 * @returns {object} The result of validation. Object contains a boolean validation result,
 *                   errors tips, and a global message for the whole form.
 */

function validateLoginForm(payload) {
  var errors = {};
  let isFormValid = true;
  let message = '';
  if (!payload || typeof payload.username !== 'string' || payload.username.trim().length === 0) {
    isFormValid = false;
    errors.username = 'Please provide your username.';
  }

  if (!payload || typeof payload.password !== 'string' || payload.password.trim().length === 0) {
    isFormValid = false;
    errors.password = 'Please provide your password.';
  }

  if (!isFormValid) {
    message = 'Check the form for errors.';
  }

  return {
    success: isFormValid,
    message,
    errors
  };
}

router.post('/signup', (req, res, next) => {
     req.data = {tmpusrnme: req.body.tmpusrnme};
  var validationResult = validateSignupForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
  return passport.authenticate('local-signup', (err) => {
    if (err) {
      if (err.name === 'MongoError' && err.code === 11000) {
        // the 11000 Mongo code is for a duplication error
        // the 409 HTTP status code is for conflict error
        return res.status(409).json({
          success: false,
          message: 'Check the form for errors.',
          errors: {
            username: 'This username is already taken.'
          }
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'You have successfully signed up! Now you should be able to log in.'
    });
  })(req, res, next);
});

router.post('/login', (req, res, next) => {
  req.data = {tmpusrnme: req.body.tmpusrnme};
  var validationResult = validateLoginForm(req.body);  
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors
    });
  }
    
  return passport.authenticate('local-login', (err, token, userData) => {
    if (err) {   
      if (err.name === 'IncorrectCredentialsError') {
        return res.status(400).json({
          success: false,
          message: err.message
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Could not process the form.'
      });
    }
    return res.status(200).json({
      success: true,
      message: 'You have successfully logged in!',
      token,
      user: userData
    });
  })(req, res, next);});

router.post('/settings', (req, res, next) => {
    var username = decodeURIComponent(req.body.username); 
    var firstname = decodeURIComponent(req.body.firstname); 
    var lastname = decodeURIComponent(req.body.lastname); 
    var city = decodeURIComponent(req.body.city); 
    var state = decodeURIComponent(req.body.state); 
    var email = decodeURIComponent(req.body.email); 
    var query  = User.where({'local.username':  username} );
    query.findOne(function (err, user) {
    if (err) {}
    else if (user) {
    User.update({'local.username': username}, {'data.firstname': firstname, 'data.lastname': lastname,
    'data.city': city, 'data.state': state, 'data.email': email}, function(err, num, rawResponse) {     
    return res.status(200).json({
      success: true,
      message: 'Your profile has been successfully updated.'
    });                                        
  });
}});});

router.post('/password', (req, res, next) => {
    var validationResult = validatePasswordForm(req.body);
  if (!validationResult.success) {
    return res.status(400).json({
      success: false,
      message: validationResult.message,
      errors: validationResult.errors});}   
    var username = decodeURIComponent(req.body.username);  
    var oldpassword = decodeURIComponent(req.body.oldpassword); 
    var newpassword = decodeURIComponent(req.body.newpassword); 
    const userData = {username: username.trim(), password: oldpassword.trim()};
    var newpassword = newpassword.trim();
    return User.findOne({'local.username': userData.username}, (err, user) => {   
    if (err) {return res.status(400).json({
          success: false,
          message: 'Could not process the form.',
          errors: 'Could not process the form.'
        }); }
    if (!user) {return res.status(400).json({
          success: false,
          message: 'Incorrect username'});}
// check if a hashed user's password is equal to a value saved in the database
  if (!(bcrypt.compareSync(userData.password, user.local.password)))
       {return res.status(400).json({
        success: false,
        message: 'Incorrect password',
        errors: 'Could not process the form.'});} 
  var localpassword = bcrypt.hashSync(newpassword, bcrypt.genSaltSync(8), null);
User.update({'local.username': userData.username}, {'local.password': localpassword}, function(err, num) {if (err) {
return res.status(400).json({
          success: false,
          message: 'Could not process the form.',
          errors: 'Could not process the form.'
        }); }
    return res.status(200).json({
      success: true,
      message: 'Your password has been successfully updated.',
      errors: 'Could not process the form.'});});});});

module.exports = router;