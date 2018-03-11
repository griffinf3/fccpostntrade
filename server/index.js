'use strict';
var path = require('path'),
  mongoose = require('./mongoose'),
  passport = require('passport'),
  express = require('express'),
  jwt = require('jsonwebtoken'),
  expressJwt = require('express-jwt'),
  router = express.Router(),
  cors = require('cors'),
  bodyParser = require('body-parser'),
  request = require('request'),
  books = require('google-books-search'),
  Config = require('./config.js');


const PORT = process.env.PORT || 4000;

mongoose();
mongoose.Promise = Promise; 

var Provider = require('./models/provider');
var app = express();
var User = require('mongoose').model('User');
app.use(passport.initialize());
var passportConfig = require('./passport');

//setup configuration
passportConfig();

// enable cors
var corsOption = {
  origin: true,
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  exposedHeaders: ['x-auth-token']
};
app.use(cors(corsOption));

// Priority serve any static files.
app.use(express.static(path.resolve(__dirname, '../client/build')));

//rest API requirements
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use('/api/v1', router);

var createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, 'my-secret',
  {
    expiresIn: 60 * 120
  });
};

var generateToken = function (req, res, next) {
  req.token = createToken(req.auth);
  return next();
};

var passportAuth1 =  function (req, res, next) {
    passport.authenticate('twitter-token', {session: false}, function(err, user, newStatus) {
    req.user = user;
      if (!req.user) {  
        return res.status(401).send('User Not Authenticated');  
      }
     req.data = {newStatus: newStatus};
      // prepare token for API
      req.auth = {
        id: req.user.id
      }; 
    return next();
    }) (req, res, next);}

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
    return res.json({newStatus: req.data.newStatus, user: req.user});
};

var passportAuth2 =  function (req, res, next) {
    passport.authenticate('google-token', {session: false}, function(err, user, newStatus) {
    req.user = user;
    //
      if (!req.user) {
        return res.status(401).send('User Not Authenticated');   
      }
     req.data = {newStatus: newStatus};
      // prepare token for API
      req.auth = {
        id: req.user.id
      }; 
    return next();
    }) (req, res, next);}

var sendToken = function (req, res) {
  res.setHeader('x-auth-token', req.token);
    return res.json({newStatus: req.data.newStatus, user: req.user});
};

router.route('/auth/twitter/reverse')
  .post(function(req, res) {
    request.post({
      url: 'https://api.twitter.com/oauth/request_token',
      oauth: {
        oauth_callback: "https%3A%2F%2Fpostntrade.herokuapp.com",
        consumer_key: Config.consumerKey,
        consumer_secret: Config.consumerSecret    
      }
    }, function (err, r, body) {
      if (err) {
        return res.status(500).send({message: err.message});  
      }
      var jsonStr = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      res.send(JSON.parse(jsonStr));
    });
  });

router.route('/auth/google')
  .post((req, res, next) => { 
  var headers = {'Content-Type': 'application/x-www-form-urlencoded'}    
  var url = 'https://accounts.google.com/o/oauth2/token';
  var payload = {
    grant_type: 'authorization_code',
    code: req.query.code,
    client_id: Config.clientID,
    client_secret: Config.clientSecret,  
    redirect_uri: 'https://postntrade.herokuapp.com'
  }; 
  request.post({url: url, form: payload, headers: headers },
  function (err, r, body) {
      if (err) {
        return res.status(500).send({message: err.message});  
      }   
     var values = JSON.parse(r.body);             
     req.body['access_token'] =  values.access_token;
     req.body['refresh_token'] =  values.refresh_token;
      next();
  });
},passportAuth2, generateToken, sendToken);       

router.route('/auth/twitter')
  .post((req, res, next) => {
    request.post({
      url: `https://api.twitter.com/oauth/access_token?oauth_verifier`,
      oauth: {
        consumer_key: Config.consumerKey,
        consumer_secret: Config.consumerSecret,    
        token: req.query.oauth_token
      },
      form: { oauth_verifier: req.query.oauth_verifier }
    }, function (err, r, body) {
      if (err) {
          return res.status(500).send({message: err.message});  
      }
      const bodyString = '{ "' + body.replace(/&/g, '", "').replace(/=/g, '": "') + '"}';
      const parsedBody = JSON.parse(bodyString);
      req.body['oauth_token'] = parsedBody.oauth_token;
      req.body['oauth_token_secret'] = parsedBody.oauth_token_secret;
      req.body['user_id'] = parsedBody.user_id;
      next();
    });
  }, passportAuth1, generateToken, sendToken);

router.route('/books*')
  .get(function(req, res) {
var querydata =  req.query.querydata;
var searchtype = req.query.searchtype;
var number = req.query.number;
if (searchtype == 2)
{
   var bookName = querydata;
var options = {
    key: Config.GoogleAPIKey,
    field: 'title',
    offset: 0,
    limit: number,
    type: 'books',
    order: 'relevance',
    lang: 'en'
};
    
books.search(bookName, options, function(error, results, apiResponse) {
    if ( ! error ) {
        var obj;
        var data =[];
        data.length = 0;
        if (results.length > 0)
        {
        for (var i = 0; i< results.length; i++)
        {obj = {id: results[i].id, title: results[i].title, tn: results[i].thumbnail, link: results[i].link};
         data.push(obj);  
        }       
       res.json({results: data});
        }
        else {res.json({results: null});}
        
    } else {
        console.log(error);
        res.json({results: null});
    }
});}
else
    
{request.get({url: 'https://www.googleapis.com/books/v1/volumes?q=isbn:' + querydata}, function (err, r, body) {
      if (err) {
          return res.status(500).send({message: err.message});  
      }
    if (body)
    {if (JSON.parse(body).totalItems >0) 
          {var results =  JSON.parse(body).items[0];
    var oneObjArray  = [{id: results.id, title: results.volumeInfo.title, tn: results.volumeInfo.imageLinks.thumbnail, link: results.volumeInfo.infoLink}];
    res.send({results: oneObjArray});}
     else {res.send({results: null});}
    }
    else {
        res.send({results: null});}});}});

router.route('/data*')
.get(function(req, res) { 
var username = decodeURIComponent(req.query.username); 
var query  = User.where({'local.username':  username} );
query.findOne(function (err, user) {
if (err) {}
else if (user) {
      var conditions = {'username': username}; 
     res.json({found:true, firstname: user.data.firstname, lastname: user.data.lastname, email: user.data.email, city: user.data.city, state: user.data.state, length: user.data.length, number: user.data.number, size: user.data.size});}
    else {res.json({found:false});}                                            
  });});

router.route('/requested1*')
.get(function(req, res) {
//Will be looking for books the user has posted that others have shown an interest in.  When a user shows an interest, the  
//book's status is updated from 'new' to 'requested'.
var username = decodeURIComponent(req.query.username); 
var query  = Provider.where({'username': username, 'status': 'requested'} );
query.find(function (err, provider) {
    if (err) {}
else if (provider) {var obj;
var requested = [];
requested.length = 0;
for (var i=0; i<provider.length; i++)
            {obj = {id: provider[i]._id, title: provider[i].title, link: provider[i].link, receiver: provider[i].receiver};
            requested.push(obj);      
            }
res.json({found: true, requested: requested}); 
} else res.json({found: false});  
});});

router.route('/approved1*')
.get(function(req, res) {
//Will search for books the user has posted and approved for trade.  
var username = decodeURIComponent(req.query.username); 
var query  = Provider.where({'username': username, 'status': 'approved'} );
query.find(function (err, provider) {
    if (err) {}
else if (provider) {var obj;
var approved = [];
approved.length = 0;
for (var i=0; i<provider.length; i++)
            {obj = {id: provider[i]._id, title: provider[i].title, link: provider[i].link, receiver: provider[i].receiver};
            approved.push(obj);      
            }
    res.json({found: true, approved: approved}); 
} else res.json({found: false});  
});});

router.route('/approved2*')
.get(function(req, res) {
//Will search for books others have posted that this logged in user requested and that were approved.
var username = decodeURIComponent(req.query.username); 
var query  = Provider.where({'receiver': username, 'status': 'approved'} );
query.find(function (err, provider) {
    if (err) {}
else if (provider) {var obj;
var approved = [];
approved.length = 0;
for (var i=0; i<provider.length; i++)
            {obj = {id: provider[i]._id, title: provider[i].title, link: provider[i].link, username: provider[i].username};
            approved.push(obj);}
res.json({found: true, approved: approved}); 
} else res.json({found: false});  
});});

router.route('/approve*')
.get(function(req, res) {
//Will update status from 'requested' to 'approved.
var username = decodeURIComponent(req.query.username); 
var id = decodeURIComponent(req.query.bookid);  
Provider.update({'_id': id}, {'status': 'approved'}, function(err, num) {
res.redirect('/api/v1/allbooks');});});    
    
router.route('/requested2*')
.get(function(req, res) {
//Will be looking for books others have posted that logged in user has shown an interest in.  When a user shows an //interest, the book's status is updated from 'new' to 'requested'.  The username of the person intersted in the book (the //receiver) is stored in the provider table.
var username = decodeURIComponent(req.query.username); 
var query  = Provider.where({'receiver': username, 'status': 'requested'} );
query.find(function (err, provider) {
    if (err) {}
else if (provider) {var obj;
var requested = [];
requested.length = 0;
for (var i=0; i<provider.length; i++)
            {obj = {id: provider[i]._id, title: provider[i].title, link: provider[i].link, receiver: provider[i].receiver};
            requested.push(obj);}
    res.json({found: true, requested: requested}); 
} else res.json({found: false});  
});});

router.route('/mybook*')
.get(function(req, res) {
    var username = decodeURIComponent(req.query.username).trim();
    var bookid = decodeURIComponent(req.query.bookid).trim();
    var tn = decodeURIComponent(req.query.tn).trim(); 
    var title = decodeURIComponent(req.query.title).trim(); 
    var link = decodeURIComponent(req.query.link).trim(); 
    var conditions = {'username': username, 'bookid': bookid}; 
    //Is this user's book already in the database?
    return Provider.findOne(conditions, function(err, books) {
    // no book was found; create a new provider
    if (!books) {
          conditions = {'username': username, 'bookid': bookid, 'thumbnail': tn, 'title': title, 'link': link, 'status': 'new', receiver: ''}; 
          Provider.create(conditions, function (err, result) {
         if (err) {res.json({code: 2});}
        else if (result){res.json({code: 0});}
});}
else {res.json({code: 1});}});});

router.route('/allbooks')
.get(function(req, res) {
    return Provider.find(function(err, allbooks) {
      if (!allbooks) {res.json({found: false, books: []});}
        else 
            {var obj;
             var books = [];
             books.length = 0;
             for (var i=0; i<allbooks.length; i++)
            {obj = {id: allbooks[i]._id, username: allbooks[i].username, receiver: allbooks[i].receiver, tn: allbooks[i].thumbnail, title: allbooks[i].title, link: allbooks[i].link, status: allbooks[i].status};
            books.push(obj);}
            res.json({found: true, books: books});}});});

router.route('/allbooks2*')
.get(function(req, res) {
var username = decodeURIComponent(req.query.username).trim();
    return Provider.find({'username': username}, function(err, allbooks) {
      if (!allbooks) {res.json({found: false, books: []});}
        else 
            {var obj;
             var books = [];
             books.length = 0;
             var bookreceiver;
             for (var i=0; i<allbooks.length; i++)
            {if (allbooks[i].receiver) bookreceiver = allbooks[i].receiver;
             else bookreceiver = null;       
            obj = {id: allbooks[i]._id, username: allbooks[i].username, receiver: bookreceiver, tn: allbooks[i].thumbnail, title: allbooks[i].title, link: allbooks[i].link, status: allbooks[i].status};
            books.push(obj);
            }
            res.json({found: true, books: books});}});});

router.route('/delete')
.get(function(req, res) { 
User.findOneAndRemove({'local.password': ''}).then( doc => {res.json({doc:doc})});});

router.route('/receivebook*')
  .get(function(req, res) {
//the user who wants the book:
   var username = decodeURIComponent(req.query.username).trim();
   var id = decodeURIComponent(req.query.bookid).trim(); 
   Provider.update({'_id': id}, {'status': 'requested', 'receiver': username}, function(err, num) {
       //the provider is alerted through the new status that the book is of interest to the receiver.
       res.redirect('/api/v1/allbooks');});}); 

router.route('/cancelreceive*')
  .get(function(req, res) {
    //the user who wants the book
   var receiver = decodeURIComponent(req.query.receiver).trim();
   //Just the id would be sufficient for a unique identification of the book of interest.
   var id = decodeURIComponent(req.query.bookid).trim(); 
   Provider.update({'_id': id}, {'status': 'new', 'receiver': receiver}, function(err, num) {
  res.redirect('/api/v1/allbooks');});}); 

router.route('/deletemybook')
.get(function(req, res) { 
var id = decodeURIComponent(req.query.bookid).trim();
Provider.findOneAndRemove({'_id': id}).then( doc => {
res.redirect('/api/v1/allbooks');});});

router.route('/updatedata1*')
.get(function(req, res) {
var username = decodeURIComponent(req.query.username);
var data = JSON.parse(decodeURIComponent(req.query.data));
User.update({'local.username': username}, {
    'data.length': data.length, 'data.number': data.number}, function(err, num, rawResponse) {res.json({num: num[0]})});});

router.route('/updatedata2*')
.get(function(req, res) {
var username = decodeURIComponent(req.query.username);
var data = JSON.parse(decodeURIComponent(req.query.data));
User.update({'local.username': username}, {
    'data.size': data}, function(err, num, rawResponse) {res.json({num: num[0]})});});

//for local-auth
//pass the authorization checker middleware
const authCheckMiddleware = require('./middleware/auth-check');
app.use('/api', authCheckMiddleware);

// routes
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

//All remaining requests; React app will handle routing.
app.get('*', function(request, response) {
  response.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});

module.exports = app;