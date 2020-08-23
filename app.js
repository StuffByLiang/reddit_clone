const mustacheExpress = require('mustache-express');
const express = require('express');
const bodyParser = require('body-parser')
const session = require('express-session');
const mongoose = require('mongoose');

// connect to mongodb
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("sucessfully connected to mongodb")
});

const app = express()

// set view engine to mustache
app.engine('mustache', mustacheExpress(__dirname + '/views/partials', '.mustache'));
app.set('view engine', 'mustache');
app.set('views', __dirname + '/views');

// use static files
app.use(express.static('public'))

// support post requests
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

// initialize session
app.use(session({
	secret: process.env.SESSION_SECRET,
	resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));

// import routes
const index = require('./routes/index')
const api = require('./routes/api')
const auth = require('./routes/auth')

// set routes
app.use('/', index)
app.use('/api', api) // sample API Routes
app.use('/auth', auth) // sample API Routes

// this controls the chat feature
app.socket = require('./socket');

module.exports = app
