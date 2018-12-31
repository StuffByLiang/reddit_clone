const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const Promise = require('bluebird');
const resource = 'room';

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

  post: (body) => {
    return new Promise((resolve, reject) => {
      body['subscribers'] = [body.user] //add the user id to room subscribers

      //then fetch current user
      turbo.fetchOne('user', body.user)
        .then(user => {
          body['user'] = {
            id: user.id,
            username: user.username
          }

          return turbo.create(resource, body)
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
