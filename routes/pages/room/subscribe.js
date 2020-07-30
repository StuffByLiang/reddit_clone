const Room = require("../../../models/Room");

// path : room/:slug/subscribe
module.exports = (req, res) => {
	const slug = req.params.slug;

	if(req.session == null || req.session.user == null) {
    // if no one is logged in, redirect back
    res.redirect('/room/' + slug);
  } else {
    // someone is logged in!
    Room.find({
      slug: slug
    }).lean()
      .then(rooms => {
        // add current user to the subscribers array and then update the room

        // returns true if user is found within the subscribed users already
        if(rooms[0].subscribers.indexOf(req.session.user.id) > -1) {
          res.json({
            confirmation: 'fail',
            data: 'Already subscribed!'
          })

					return;

        } else {
          // add logged in user to the subscribers
          rooms[0].subscribers.push(req.session.user.id)
          return Room.findByIdAndUpdate(rooms[0]._id, {
            subscribers: rooms[0].subscribers
          })
        }
      })
      .then(data => {
				if(data !== undefined)
	        res.json({
	          confirmation: 'success',
	          data: 'Succesfully subscribed!'
	        })
      })
      .catch(err => {
        res.json({
          confirmation: 'fail',
          data: err.message
        })
      })
  }
}
