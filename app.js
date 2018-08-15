const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const crypto = require('crypto');
var fs = require('fs');


const bodyParser = require('body-parser');
var cookieSession = require('cookie-session')

var passport = require('passport');
var SteemConnectStrategy = require('passport-steemconnect').Strategy;


// Set Port
const port = 8080;

// Init app
const app = express();

// View Engine\
app.engine('handlebars', exphbs({defaultLayout:'main'}));
app.set('view engine', 'handlebars');
app.use(express.static(path.join(__dirname, 'public')));

// body-parser
app.use(bodyParser.json());
app.use(require('cookie-parser')());

app.use(bodyParser.urlencoded({extended:false}));
app.use(cookieSession({
  name: 'session',
  keys: ['secret'],
  maxAge: 60 * 60 * 1000   //1 hour
}))

// methodOverride


// PASSPORT        PASSSSS ------------------------    PAAAASSSSS



passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


passport.use(new SteemConnectStrategy({
  authorizationURL: `https://v2.steemconnect.com/oauth2/authorize`,
  tokenURL: `https://v2.steemconnect.com/api/oauth2/token`,
  clientID: 'YOUR CLIENT ID',
  clientSecret: 'YOUR CLIENT SECRET',
  callbackURL: `http://localhost:8080/auth/oauth/oauth2/callback`,
  scope: ['login'],
  },
  function(accessToken, refreshToken, profile, cb) {
    return cb(null, profile);
   }   ));




    app.use(passport.initialize());
    app.use(passport.session());




    app.get('/logout', function (req, res){
          req.logOut();
          delete req.session.linkoo;
          delete req.session.link;
          res.redirect('/');

});

app.get('/steemit/login',
    passport.authenticate('steemconnect'));

app.get('/auth/oauth/oauth2/callback',
    passport.authenticate('steemconnect', { failureRedirect: '/about' }),
    function(req, res) { req.session.linkoo = "steemit";  res.redirect('/');  delete req.session.returnTo;  });




// Search Page
app.get('/', function(req, res, next){
    res.render('searchusers', {us: req.user});   });




app.listen(port, function(){
  console.log('Server started on port '+port);
});
