const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const Promise = require('bluebird');
const resource = 'user';

module.exports = {
  get: (params) => {
    return new Promise((resolve, reject) => {
      turbo.fetch(resource, params)
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
      turbo.fetchOne(resource, id)
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
      turbo.create(resource, body)
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
      turbo.updateEntity(resource, req.session.user.id, {
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
