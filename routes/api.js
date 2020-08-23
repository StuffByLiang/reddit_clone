var express = require('express')
var router = express.Router()
const controllers = require('../controllers') //i dont understand the point of controllers

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
	if(req.session == null || req.session.user == null) {
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
	if(req.session == null || req.session.user == null) {
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
