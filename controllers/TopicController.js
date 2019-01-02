const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const Promise = require('bluebird');
const resource = 'topic';

const slugify = function(text){
 	return text.toString().toLowerCase()
			.replace(/\s+/g, '-')           // Replace spaces with -
			.replace(/[^\w\-]+/g, '')       // Remove all non-word chars
			.replace(/\-\-+/g, '-')         // Replace multiple - with single -
			.replace(/^-+/, '')             // Trim - from start of text
			.replace(/-+$/, '');            // Trim - from end of text
}

const randomString = function(numChars) {
    var randomString = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (var i=0; i < numChars; i++) {
      randomString += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return randomString;
}

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

      // if logged in, do this stuff, otherwise reject.
      if(req.vertexSession == null || req.vertexSession.user == null) {
          reject({message: "Not logged in. Cannot create a new topic."})
        } else {
          // logged in!
          body.slug = slugify(body.title.toLowerCase().substr(0,40))+'-'+randomString(6); //add a slug that is the first 40 characters of the title + some random letters at the end to make it unique fo sho
          body.numReplies = 0;
          //check if room exists

          turbo.fetch('room', {
            slug: body.room
          })
            .then(rooms => {
              if(rooms.length > 0) {
      	        //if found within the database, everything is okay, next get user info
                body.room = {
                  slug: body.room,
                  name: rooms[0].category
                }
      	        return turbo.fetchOne('user', req.vertexSession.user.id)

      	      } else if(rooms.length === 0) {
      	        //if there are no results, throw an error
      	        reject({message: "Room not found"})
      	      }
            })
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
        }
    })
  }
}
