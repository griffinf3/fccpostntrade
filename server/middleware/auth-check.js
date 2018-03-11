var jwt = require('jsonwebtoken');
var User = require('mongoose').model('User');

/**
 *  The Auth Checker middleware function.
 */
   
var obj1 = {"jwtSecret": "a secret phrase!!"};
  
module.exports = function(req,res,next) {

     if (!req.headers.authorization) {
    return res.status(401).end();}

// get the last part from a authorization header string like "bearer token-value"
  var token = req.headers.authorization.split(' ')[1];

  // decode the token using a secret key-phrase
  return jwt.verify(token, obj1.jwtSecret, (err, decoded) => {
    // the 401 code is for unauthorized status
    if (err) { return res.status(401).end(); }

    var userId = decoded.sub;

    // check if a user exists
    return User.findById(userId, (userErr, user) => {
      if (userErr || !user) {
        return res.status(401).end();
      }

      return next();
    });
  });
};
