const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const validRegex = /^[a-zA-Z0-9_-]{6,16}$/;

router.post('/register', (req, res) => {
  if(!validRegex.test(req.body.username)) {
    res.json({
      confirmation: 'fail',
      message: 'Username must be at least 6 characters up to a max of 16, and must contain letters, numbers, or hyphens (-) and underscores (_)'
    })
  } else {
    User.findOne({ lowercase: req.body.username.toLowerCase() })
      .then(async user => {
        if(user) {
          //if username is found within database, throw an error
          res.json({
            confirmation: 'fail',
            message: "Username already exists"
          })
          return;

        } else {
          //if there are no results, continue on!

          req.body.lowercase = req.body.username.toLowerCase(); // add a lower case form of the username for authentication

          return User.create({
            ...req.body,
            password: await bcrypt.hash(req.body.password, saltRounds)
          })
        }
      })
      .then(data => {
        req.session.user = {id: data.id}

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
    User.findOne({lowercase: req.body.username.toLowerCase()})
    .then(async data => {
      console.log(data)
      if(!data) {
        res.json({
          confirmation: 'fail',
          message: "cannot find username"
        })
        return;
      }

      const result = await bcrypt.compare(req.body.password, data.password);

      if(result) {
        req.session.user = {id: data.id}

        res.json({
          confirmation: 'success',
          message: data
        })
      } else {
        req.session.user = {id: data.id}

        res.json({
          confirmation: 'fail',
          message: "wrong password"
        })
      }
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
    if(req.session == null || req.session.user == null) {
      res.json({
        confirmation: 'success',
        user: null
      })
      return
    } else {
      //someone logged in
      User.findById(req.session.user.id)
        .then(data => {
          if (!data) {
            res.json({
              confirmation: 'fail',
              message: "cannot find user"
            });
            return;
          }
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

router.post('/hash', async (req, res) => {
  res.send(await bcrypt.hash(req.body.string, saltRounds))
})

router.get('/logout', (req, res) => {

  req.session.destroy() //delete session variable
  res.redirect('/'); //redirect to home

})

module.exports = router
