// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()
const controllers = require('../controllers') //i dont understand the point of controllers

// router.get('/special', (req, res) => {
// 	turbo.fetch('reply', null)
// 		.then(replys => {
// 			for(reply of replys) {
// 				turbo.removeEntity('reply', reply.id).then(data=>{console.log(data)})
// 			}
// 		})
// })
//
// router.get('/special2', (req, res) => {
// 	turbo.fetch('topic', null)
// 		.then(replys => {
// 			for(reply of replys) {
// 				turbo.updateEntity('topic', reply.id, {
// 					numReplies: 0
// 				}).then(data=>{console.log(data)})
// 			}
// 		})
// })

router.post('/:resource', (req, res) => {

	const resource = req.params.resource;

	const controller = controllers[resource];
	if(controller == null){
		res.json({
			confirmation: 'fail',
			data: 'Invalid resource: ' + resource
		})
		return;
	}


	controller.post(req, req.body)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: data
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.get('/:resource', (req, res) => {
	const resource = req.params.resource;

	const controller = controllers[resource];
	if(controller == null){
		res.json({
			confirmation: 'fail',
			data: 'Invalid resource: ' + resource
		})
		return;
	}

	controller.get(req.query)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: data
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.get('/:resource/:id', (req, res) => {
	const resource = req.params.resource;

	const controller = controllers[resource];
	if(controller == null){
		res.json({
			confirmation: 'fail',
			data: 'Invalid resource: ' + resource
		})
		return;
	}

	controller.getById(req.params.id)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: data
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.post('/reply/second-level', (req, res) => {
	const controller = controllers['reply'];

	controller.postSecondLevel(req, req.body)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: data
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.post('/task/second-level', (req, res) => {
	const controller = controllers['task'];

	controller.postSecondLevel(req, req.body)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: data
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.post('/task/check', (req, res) => {
	const controller = controllers['task'];

	controller.check(req, req.body)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: data
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.post('/task/delete', (req, res) => {
	const controller = controllers['task'];

	controller.delete(req, req.body)
		.then(data => {
			res.json({
				confirmation: 'success',
				data: data
			})
		})
		.catch(err => {
			res.json({
				confirmation: 'fail',
				data: err.message
			})
		})
})

router.post('/user/update', (req, res) => {
	const controller = controllers['user'];

	// check if user is logged in
	if(req.vertexSession == null || req.vertexSession.user == null) {
		// not logged in
		res.json({
			confirmation: 'fail',
			data: 'not logged in'
		})
	} else {
		// user is logged in, continue
		controller.update(req, req.body)
			.then(data => {
				res.json({
					confirmation: 'success',
					data: data
				})
			})
			.catch(err => {
				res.json({
					confirmation: 'fail',
					data: err.message
				})
			})
		}
})

router.post('/topic/update', (req, res) => {
	const controller = controllers['topic'];

	// check if user is logged in
	if(req.vertexSession == null || req.vertexSession.user == null) {
		// not logged in
		res.json({
			confirmation: 'fail',
			data: 'not logged in'
		})
	} else {
		// user is logged in, continue
		controller.update(req, req.body)
			.then(data => {
				res.json({
					confirmation: 'success',
					data: data
				})
			})
			.catch(err => {
				res.json({
					confirmation: 'fail',
					data: err.message
				})
			})
		}
})
module.exports = router
