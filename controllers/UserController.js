const Promise = require('bluebird');
const User = require('../models/User');
const resource = 'user';

module.exports = {
  get: (params) => {
    return new Promise((resolve, reject) => {
      User.find(params)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  getById: (id) => {
    return new Promise((resolve, reject) => {
      User.findById(id)
        .then(data => {
          resolve(data)
        })
        .catch(err => {
          reject(err)
        })
    })
  },

  post: (req, body) => {
    return new Promise((resolve, reject) => {
      User.create(body)
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
    })
  },

  update: (req, body) => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(req.session.user.id, {
        [body.name]: body.value
      })
      .then(data => {
        resolve(data)
      })
      .catch(err => {
        reject(err)
      })
    })
  }
}
