const helpers = require('../../helpers');

const CDN = '';

module.exports = (req, res) => {

	if(req.session == null || req.session.user == null) {
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
