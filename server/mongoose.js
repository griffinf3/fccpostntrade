'use strict';

var mongoose = require('mongoose'), 
bcrypt = require('bcrypt-nodejs'),
jwt = require('jsonwebtoken'),
Schema = mongoose.Schema;

module.exports = function () {

//var db = mongoose.connect('mongodb://localhost:27017/twitter-demo');
var db = mongoose.connect(process.env.MONGODB_URI); 
    
var secretObj= {'jwtSecret': "a secret phrase!!"};

var UserSchema = new Schema({  
    local            : {
    username: {type: String,
               index: { unique: true }},
    password: String
    },  
    twitterProvider: {
        type: {
        id: String,
        token: String,
        tokenSecret: String        
        }
    },
    googleProvider: { 
        type: {
        id: String,
        accessToken: String,
        refreshToken: String}},
    data: {
        type: {
        firstname: String,
        lastname: String,
        city: String,
        state: String,
        email: String,
        length: String,
        number: String,
        size: String
        }}
  });
    
  UserSchema.set('toJSON', {getters: true, virtuals: true});
      
///////////////////////////////////////   
    
 UserSchema.statics.locateLocalUser = function(req, username, password, done)
 {var that = this;
 const userData = {username: username.trim(), password: password.trim()
  }; 
   return that.findOne({'local.username': userData.username }, (err, user) => {   
    if (err) { return done(err); }
    if (!user) {
      const error = new Error('Username not found');
      error.name = 'IncorrectCredentialsError';
      return done(error);
    }

    // check if a hashed user's password is equal to a value saved in the database
  
      if (!user.validPassword(userData.password))
       {
        const error = new Error('Incorrect password');
        error.name = 'IncorrectCredentialsError';
        return done(error);
       }
      const payload = {
        sub: user._id
      };
      // create a token string
      const token = jwt.sign(payload, secretObj.jwtSecret); 
      req.auth = {id: user._id};
      var tmpusrnme = req.data.tmpusrnme;
      if (tmpusrnme != '') 
       {return that.findOne({
       'local.username': tmpusrnme}).exec(function(err, user){
        var res = tmpusrnme.charAt(0);
        if (res == 'g')
         //it was google.
        {var id = user.googleProvider.id;
         var accessToken = user.googleProvider.accessToken;
         var refreshToken =  user.googleProvider.refreshToken; 
return that.findOne({'local.username': username.trim()}).exec(function(err, user) {
var conditions =  {'googleProvider.id': id, 'googleProvider.accessToken': accessToken,
         'googleProvider.refreshToken': refreshToken};
return user.update(conditions).exec(function (error, updatedUser) {if (error) {}                          return that.findOneAndRemove({'local.username': tmpusrnme}).exec(function(err){if (err){} return done(null, token);})});});}
  else { var id = user.twitterProvider.id;
         var token = user.twitterProvider.token;
         var tokenSecret =  user.twitterProvider.tokenSecret;
return that.findOne({'local.username': username.trim()}).exec(function(err, user) {
var conditions =  {'twitterProvider.id': id, 'twitterProvider.token': token,
         'twitterProvider.tokenSecret': tokenSecret}; 
return user.update(conditions).exec(function (error, updatedUser) {if (error) {}                          return that.findOneAndRemove({'local.username': tmpusrnme}).exec(function(err){if (err){} return done(null, token);
})});});}});}else return done(null, token);});};
   ///////////////////////////////////////////////////////
    
UserSchema.statics.upsertLocalUser = function(req, username, password, cb)
  {var that = this;
   var tmpusrnme = req.data.tmpusrnme;
   //if a tmpusrnme was sent,
   //then combine social media data with local data.
   if (tmpusrnme != '')
   {var newusername = username;
    username = req.data.tmpusrnme;
       return this.findOne({
      'local.username': username
    }, function(err, user) {
          //update Social Media Account with local signin data.
           var hashedpw = user.generateHash(password);
           user.local.username=newusername;
           user.local.password= hashedpw;
           user.data.city = '';
           user.data.state = ''; 
           user.data.lastname = '';
           user.data.firstname = ''; 
           user.data.email = '';
           user.data.length = '10';
           user.data.number = '20';
           user.data.size = 'small';
           user.save(function(error, updatedUser) {
            if (error) {
            console.log(error);
          }   
          return cb(error, updatedUser);});})}
   else {
   return this.findOne({
      'local.username': username
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
          // set the user's local credentials
        var newUser = new that({
         data: {
            city: '',
            state: '',
            lastname: '',
            firstname: '',
            email: '',
            length: '10',
            number: '20',
            size: 'small'
          }
        });
        newUser.local.username    = username;
        newUser.local.password = newUser.generateHash(password);
        newUser.save(function(error, savedUser) {
          if (error) {}
          return cb(error, savedUser);
        });
      } else {
        return cb(err, user);
      }});}};
 
  UserSchema.statics.upsertTwitterUser = function(req, token, tokenSecret, profile, cb) {
    var that = this;
    return this.findOne({
      'twitterProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) { 
        var newUser = new that({twitterProvider: {
            id: profile.id,
            token: token,
            tokenSecret: tokenSecret 
          },
        data: {
            city: '',
            state: '',
            lastname: '',
            firstname: '',
            email: '',
            length: '10',
            number: '20',
            size: 'small'
        }
        });
        //create temp username.
        newUser.local.username = 't' + Date.now(); 
        newUser.local.password = '';
        newUser.save(function(error, savedUser) {
          if (error) {}
          var newStatus = true;
          return cb(error, savedUser, newStatus);
        });
      } else {var newStatus = false;
        return cb(err, user, newStatus);
      }
    });
  };
    
  UserSchema.statics.upsertGoogleUser = function(req, accessToken, refreshToken, profile, cb) {
    var that = this;
    return this.findOne({
      'googleProvider.id': profile.id
    }, function(err, user) {
      // no user was found, lets create a new one
      if (!user) {
        var newUser = new that({
         googleProvider: {
         id: profile.id,
         accessToken: accessToken,
         refreshToken: refreshToken
         },
        data: {
            city: '',
            state: '',
            lastname: '',
            firstname: '',
            email: '',
            length: '10',
            number: '20',
            size: 'small'
        }
        });
          //add unqiue username.
        newUser.local.username = 'g' + Date.now();
        newUser.local.password = '';
        newUser.save(function(error, savedUser) {
          if (error) {}
          var newStatus = true;
          
          return cb(error, savedUser, newStatus);
        });
      } else {
        var newStatus =  false;
        return cb(err, user, newStatus);
      }  
    });
  };  
    
// methods ======================
// generating a hash
UserSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);};

// checking if password is valid
UserSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};
    
mongoose.model('User', UserSchema);
return db;
};
