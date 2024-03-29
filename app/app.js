const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const config = require('./config/database');

mongoose.connect('mongodb://dbcos:b7Qx6AA01oOSTJ9EpJV4X5KYjpVhzSoQHENV0qegqE5k8Mbpr18pQznex9YCBaOkCSvyfTivBYKPDGk1CFvyag==@dbcos.documents.azure.com:10255/scenario/?ssl=true&replicaSet=globaldb');
let db = mongoose.connection;

// Check connection
db.once('open', function () {
  console.log('Connected to MongoDB');
});

// Check for DB errors
db.on('error', function (err) {
  console.log(err);
});

// Init App
const app = express();

// Bring in Models
let Data = require('./models/data');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Body Parser Middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

// Set Public Folder
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
}));

// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function (req, res, next) {
  res.locals.messages = require('express-messages')(req, res);
  next();
});

// Express Validator Middleware
app.use(expressValidator({
  errorFormatter: function (param, msg, value) {
    var namespace = param.split('.')
      , root = namespace.shift()
      , formParam = root;

    while (namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param: formParam,
      msg: msg,
      value: value
    }
  }
}));

// Passport Config
require('./config/passport')(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function (req, res, next) {
  res.locals.user = req.user || null;
  next();
});


// Home Route
app.get('/', function (req, res) {
  if (req.user) {
    Data.find({author: req.user._id}, function (err, datares) {
      if (err) {
        console.log(err);
      } else {

        res.render('index', {
          title: 'Logs',
          datares: datares
        });
      }
    });
  }
  else {
    res.render('login', {
      title: 'Home'
    });
  }
});


// Route Files
let data = require('./routes/data');
let users = require('./routes/users');
app.use('/data', data);
app.use('/users', users);

// Start Server
app.listen(3000, function () {
  console.log('Server started on port 3000...');
});
