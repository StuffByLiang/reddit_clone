const Promise = require('bluebird');
const resource = 'topic';
const Topic = require('../models/Topic');
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
      Topic.find(params)
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
      Topic.findById(id)
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
          reject({message: "Not logged in. Cannot create a new topic."})
        } else {
          // logged in!
          body.slug = slugify(body.title.toLowerCase().substr(0,40))+'-'+randomString(6); //add a slug that is the first 40 characters of the title + some random letters at the end to make it unique fo sho
          body.numReplies = 0;
          //check if room exists

          Room.find({
            slug: body.room
          })
            .then(rooms => {
              if(rooms.length > 0) {
      	        //if found within the database, everything is okay, next get user info
                body.room = {
                  slug: body.room,
                  name: rooms[0].category
                }
      	        return User.findById(req.session.user.id)

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
              console.log(body)
              return Topic.create(body)
            })
            .then(data => {
              resolve(data)
            })
            .catch(err => {
              reject(err)
            })
        }
    })
  },
  update: (req, body) => {
    return new Promise((resolve, reject) => {

      // fetch topic using topicSlug
      Topic.find({slug: body.topicSlug })
        .then(topics => {
          // get the topicId from the topicSlug
          return Topic.findByIdAndUpdate(topics[0].id, {
            description: body.description
          });
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
