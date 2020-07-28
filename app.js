// Full Documentation - https://www.turbo360.co/docs
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const mustacheExpress = require('mustache-express');
const express = require('express')
const bodyParser = require('body-parser')
const session = require('express-session');
const cookieParser = require('cookie-parser');

// const app = vertex.express() // initialize app

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
