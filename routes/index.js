// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

const helpers = require('./helpers');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

/*  This is the home route. It renders the index.mustache page from the views directory.
	Data is rendered using the Mustache templating engine. For more
	information, view here: https://mustache.github.io/#demo */
router.get('/', (req, res) => {

	config = {
		cdn: CDN
	};

	helpers.displayPage(req, res, 'index', config);

})

router.get('/posts', (req, res) => {

	const recentTopics = [
		{
			room: 'Sports',
			topic: 'Soccer sucks',
			user: 'LoreOfLies',
			numReplies: 4,
			date: 'March 20, 2018'
		},
		{
			room: 'Sports',
			topic: 'I\'m gay',
			user: 'LoreOfLies',
			numReplies: 4,
			date: 'March 20, 2018'
		}
	]

	config = {
		cdn: CDN,
		topics: recentTopics
	}

	helpers.displayPage(req, res, 'posts', config);

})

router.get('/rooms', (req, res) => {
	res.render('rooms', null)
})

router.get('/room/:category', (req, res) => {
	const category = req.params.category;

	//fetch from database room with category that matches the paramater 'category'
	turbo.fetch('room', {
		category: category
	})
		.then(data => {
			if(data.length > 0) {
				//if found within the database, render the room
				res.render('room', {
					room: category
				})
			} else if(data.length === 0) {
				//if there are no results, tell client the room was not found
				res.json({
					confirmation: 'fail',
					data: 'Room not found: ' + category
				})
			}
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.get('/addroom', (req, res) => {

	if(req.vertexSession == null || req.vertexSession.user == null) {
		//redirect to home if not logged in
		res.redirect('/');
		return;
	}

	config = {
		cdn: CDN
	};

	helpers.displayPage(req, res, 'addroom', config);

})

module.exports = router
