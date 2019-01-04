const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})

// path : room/:slug/subscribe
module.exports = (req, res) => {
	const slug = req.params.slug;

	if(req.vertexSession == null || req.vertexSession.user == null) {
    // if no one is logged in, redirect back
    res.redirect('/room/' + slug);
  } else {
    // someone is logged in!
    turbo.fetch('room', {
      slug: slug
    })
      .then(rooms => {
        // add current user to the subscribers array and then update the room

        // returns true if user is found within the subscribed users already
        if(rooms[0].subscribers.indexOf(req.vertexSession.user.id) > -1) {
          res.json({
            confirmation: 'fail',
            data: 'Already subscribed!'
          })
        } else {
          // add logged in user to the subscribers
          rooms[0].subscribers.push(req.vertexSession.user.id)

          return turbo.updateEntity('room', rooms[0].id, {
            subscribers: rooms[0].subscribers
          })
        }
      })
      .then(data => {
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
