const helpers = require('../../helpers');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {

	if(req.vertexSession == null || req.vertexSession.user == null) {
		//redirect to home if not logged in
		res.redirect('/');
		return;
	}

	config = {
		cdn: CDN,
		pageTitle: 'Add A Room'
	};

	helpers.displayPage(req, res, 'addroom', config);

}
