// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

const ta = require('time-ago')

const helpers = require('./helpers');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
router.get('/', (req, res) => {

	config = {
		cdn: CDN,
		pageTitle: 'Home'
	};

	helpers.displayPage(req, res, 'index', config);

})

router.get('/posts', (req, res) => {

	config = {
		cdn: CDN,
		pageTitle: 'Latest Posts'
	}

	//get all recent topics
	turbo.fetch('topic', null)
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

router.get('/rooms', (req, res) => {
	res.render('rooms', null)
})

router.get('/room/:slug', require('./pages/room/slug.js'))
router.get('/room/:slug/addtopic', require('./pages/room/addtopic.js'))

router.get('/addroom', require('./pages/addroom'))

router.get('/room/:slug/topic/:topicSlug', require('./pages/room/topic.js'))

module.exports = router
