const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const Promise = require('bluebird');
const resource = 'reply';

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
          reject({message: "Not logged in. Cannot reply with a comment."})
        } else {
          // logged in!

          //check if room exists
          turbo.fetch('topic', {
            slug: body.topicSlug
          })
            .then(topics => {
              if(topics.length > 0) {
      	        //if found within the database, everything is okay
                body.to = {
                  slug: topics[0].slug,
                  id: topics[0].id,
                  topicId: topics[0].id
                }

                // Now update topic number of replies
                return turbo.updateEntity('topic', topics[0].id, {
                  numReplies: topics[0].numReplies + 1
                });

      	      } else if(topics.length === 0) {
      	        //if there are no results, throw an error
      	        reject({message: "Topic not found."})
      	      }
            })
            .then(data => {
              // then get user data
              return turbo.fetchOne('user', req.vertexSession.user.id)
            })
            .then(user => {
              body['user'] = {
                id: user.id,
                username: user.username
              }

              body.type = "first-level";

              return turbo.create(resource, body);
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
      if(req.vertexSession == null || req.vertexSession.user == null) {
          reject({message: "Not logged in. Cannot reply with a comment."})
        } else {
          // logged in!

          //check if reply exists
          turbo.fetchOne('reply', body['to[replyId]'])
            .then(reply => {
              console.log('reply');

              body['to'] = {
                username: reply.user.username,
                userId: reply.user.id,
                replyId: body['to[replyId]'],
                topicId: reply.to.topicId
              }

              delete body['to[replyId]']; // idk this is some bug

              // Now fetch topic
              return turbo.fetchOne('topic', reply.to.topicId);
            })
            .then(topic => {
              // Now update the topic number of replys
              return turbo.updateEntity('topic', topic.id, {
                numReplies: topic.numReplies + 1
              });
            })
            .then(data => {
              // if found within the database, everything is okay, next get user info
    	        return turbo.fetchOne('user', req.vertexSession.user.id)
            })
            .then(user => {
              body['user'] = {
                id: user.id,
                username: user.username
              }

              body.type = "second-level";

              return turbo.create(resource, body);
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
