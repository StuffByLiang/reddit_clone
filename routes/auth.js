// Full Documentation - https://www.turbo360.co/docs
const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const vertex = require('vertex360')({site_id: process.env.TURBO_APP_ID})
const router = vertex.router()

router.post('/register', (req, res) => {
  turbo.createUser(req.body)
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
          confirmation: 'fail',
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
