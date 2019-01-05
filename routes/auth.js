// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

const validRegex = /^[a-zA-Z0-9_-]{6,16}$/;

router.post('/register', (req, res) => {
  if(!validRegex.test(req.body.username)) {
    res.json({
      confirmation: 'fail',
      message: 'Username must be at least 6 characters up to a max of 16, and must contain letters, numbers, or hyphens (-) and underscores (_)'
    })
  } else {
    turbo.fetch('user', { username: req.body.username })
      .then(user => {
        if(user.length > 0) {
          //if username is found within database, throw an error
          res.json({
            confirmation: 'fail',
            message: "Username already exists"
          })
          return;

        } else if(user.length === 0) {
          //if there are no results, continue on!

          req.body.lowercase = req.body.username.toLowerCase(); // add a lower case form of the username for authentication

          return turbo.createUser(req.body)
        }
      })
      .then(data => {
        req.vertexSession.user = {id: data.id}

        res.json({
          confirmation: 'success',
          message: data
        })
      })
      .catch(err => {
        res.json({
          confirmation: 'fail',
          message: err.message
        })
      })
  }
})

  router.post('/login', (req, res) => {
    turbo.login(req.body)
    .then(data => {
      //succesful login! set vertexSession

      req.vertexSession.user = {id: data.id}

      res.json({
        confirmation: 'success',
        message: data
      })
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        message: err.message
      })
    })
  })

  router.get('/currentuser', (req, res) => {

    // no one logged in
    if(req.vertexSession == null || req.vertexSession.user == null) {
      res.json({
        confirmation: 'success',
        user: null
      })
      return
    } else {
      //someone logged in
      turbo.fetchOne('user', req.vertexSession.user.id)
        .then(data => {
          res.json({
            confirmation: 'success',
            message: data
          });
        })
        .catch(err => {
          res.json({
            confirmation: 'fail',
            message: err.message
          })
        })
      }

})

router.get('/logout', (req, res) => {

  req.vertexSession.reset() //delete session variable
  res.redirect('/'); //redirect to home

})

module.exports = router
