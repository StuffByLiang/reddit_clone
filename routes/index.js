const router = require('express').Router()

const ta = require('time-ago')

const helpers = require('./helpers');
const Topic = require('../models/Topic');

const CDN = '';

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
router.get('/', (req, res) => {

	config = {
		cdn: CDN,
		pageTitle: 'Latest Posts'
	}

	//get all recent topics
	Topic.find({}).sort({'timestamp': 'desc'}).lean()
    .then(topics => {
      config['topics'] = topics;

			// convert date time into FORMAT ___ units ago
			for(topic of config.topics) {
				topic.timestamp = ta.ago(topic.timestamp);
			}

      // get the room that is being fetched on the page params
      helpers.displayPage(req, res, 'posts', config);
    })
		.catch(err => {
			res.render('posts', config);
		})

})

router.get('/posts', (req, res) => {

	config = {
		cdn: CDN,
		pageTitle: 'Latest Posts'
	}

	//get all recent topics
	Topic.find({}).sort({'timestamp': 'desc'}).lean()
    .then(topics => {
      config['topics'] = topics;

			// convert date time into FORMAT ___ units ago
			for(topic of config.topics) {
				topic.timestamp = ta.ago(topic.timestamp);
			}

      // get the room that is being fetched on the page params
      helpers.displayPage(req, res, 'posts', config);
    })
		.catch(err => {
			res.render('posts', config);
		})

})

router.get('/rooms', require('./pages/rooms'))

router.get('/room/:slug', require('./pages/room/slug.js'))
router.get('/room/:slug/addtopic', require('./pages/room/addtopic.js'))

router.post('/room/:slug/subscribe', require('./pages/room/subscribe.js'))

router.get('/addroom', require('./pages/addroom'))

router.get('/room/:slug/topic/:topicSlug', require('./pages/room/topic.js'))

router.get('/room/:slug/topic/:topicSlug/edit', require('./pages/room/edittopic.js'))

router.get('/user/:user', require('./pages/user'))
router.get('/editprofile', require('./pages/editprofile'))

/************* Apps *************/
router.get('/apps/todo', require('./pages/apps/todo'))

module.exports = router
