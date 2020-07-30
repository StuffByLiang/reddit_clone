const Promise = require('bluebird');
const resource = 'room';
const Room = require('../models/Room');
const User = require('../models/User');

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
      Room.find(params)
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
      Room.findById(id)
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
      if(req.session == null || req.session.user == null) {
          reject({message: "Not logged in. Cannot create a room"})
        } else {
          // logged in!
          body['subscribers'] = [req.session.user.id]; //add the user id to room subscribers
          body['slug'] = slugify(body.category.toLowerCase().substr(0,40));

          // check if the room as been created before
          Room.find({ slug: body.slug })
            .then(rooms => {
              if(rooms.length > 0) {
      	        //if found within the database, do not create the room!
      	        reject({message: "There is already a room with the same name!"});

      	      } else if(rooms.length === 0) {
      	        //if there are no results, continue on with fetching the user
      	        return User.findById(req.session.user.id);
      	      }
            })
            .then(user => {
              body['user'] = {
                id: user.id,
                username: user.username
              }

              return Room.create(body)
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
