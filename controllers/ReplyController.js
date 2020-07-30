const Promise = require('bluebird');
const Reply = require('../models/Reply');
const Topic = require('../models/Topic');
const User = require('../models/User');
const resource = 'reply';

module.exports = {
  get: (params) => {
    return new Promise((resolve, reject) => {
      Reply.find(params)
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
      Reply.findById(id)
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
          reject({message: "Not logged in. Cannot reply with a comment."})
        } else {
          // logged in!

          //check if room exists
          Topic.find({
            slug: body.topicSlug
          })
            .then(topics => {
              if(topics.length > 0) {
      	        //if found within the database, everything is okay
                body.to = {
                  slug: topics[0].slug,
                  id: topics[0].id,
                  topicId: topics[0].id,
                  replyId: topics[0].id
                }

                // Now update topic number of replies
                return Topic.findByIdAndUpdate(topics[0].id, {
                  numReplies: topics[0].numReplies + 1
                });

      	      } else if(topics.length === 0) {
      	        //if there are no results, throw an error
      	        reject({message: "Topic not found."})
      	      }
            })
            .then(data => {
              // then get user data
              return User.findById(req.session.user.id)
            })
            .then(user => {
              body['user'] = {
                id: user.id,
                username: user.username
              }

              body.type = "first-level";

              return Reply.create(body);
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

  postSecondLevel: (req, body) => {
    return new Promise((resolve, reject) => {
      console.log(body)
      // if logged in, do this stuff, otherwise reject.
      if(req.session == null || req.session.user == null) {
          reject({message: "Not logged in. Cannot reply with a comment."})
        } else {
          // logged in!

          //check if reply exists
          console.log(body.to.replyId)
          Reply.findById(body.to.replyId)
            .then(reply => {
              console.log(reply)

              console.log(body.to)
              let commentId = body.to.commentId;
              body['to'] = {
                username: reply.user.username,
                userId: reply.user.id,
                replyId: commentId,
                topicId: reply.to.topicId
              }
              console.log(body.to)

              // delete body['to[replyId]']; // idk this is some bug
              // delete body['to[commentId]']; // idk this is some bug

              // Now fetch topic
              return Topic.findById(reply.to.topicId);
            })
            .then(topic => {
              // Now update the topic number of replys
              return Topic.findByIdAndUpdate(topic.id, {
                numReplies: topic.numReplies + 1
              });
            })
            .then(data => {
              // if found within the database, everything is okay, next get user info
    	        return User.findById(req.session.user.id)
            })
            .then(user => {
              body['user'] = {
                id: user.id,
                username: user.username
              }

              body.type = "second-level";

              return Reply.create(body);
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
