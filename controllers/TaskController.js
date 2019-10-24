const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const Promise = require('bluebird');
const resource = 'task';

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
        // not logged in
          reject({message: "Not logged in. Cannot add task."})
      } else {
        // logged in!

        // get user data
        turbo.fetchOne('user', req.vertexSession.user.id)
          .then(user => {
            body['user'] = {
              id: user.id,
              username: user.username
            }

            body.type = 'first-level';
            body.checked = false;

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
  },
  postSecondLevel: (req, body) => {
    return new Promise((resolve, reject) => {
      console.log(body)
      // if logged in, do this stuff, otherwise reject.
      if(req.vertexSession == null || req.vertexSession.user == null) {
          reject({message: "Not logged in. Cannot add subtask."})
        } else {
          // logged in!

          //check if first level task exists
          turbo.fetchOne('task', body['task'])
            .then(task => {
              // Now fetch topic
               return turbo.fetchOne('user', req.vertexSession.user.id);
            })
            .then(user => {
              body['user'] = {
                id: user.id,
                username: user.username
              }

              body.type = "second-level";
              body.checked = false;

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
  check: (req, body) => {
    return new Promise((resolve, reject) => {
      // if logged in, do this stuff, otherwise reject.
      if(req.vertexSession == null || req.vertexSession.user == null) {
          reject({message: "Not logged in. Cannot check/uncheck."})
        } else {
          // logged in!

          //update entity
          turbo.updateEntity('task', body['id'], {
            checked: body['checked']
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
  delete: (req, body) => {
    return new Promise((resolve, reject) => {
      // if logged in, do this stuff, otherwise reject.
      if(req.vertexSession == null || req.vertexSession.user == null) {
          reject({message: "Not logged in. Cannot check/uncheck."})
        } else {
          // logged in!

          //get subtasks
          turbo.fetch('task', {
            task: body['task']
          })
            .then(tasks => {
              if(tasks.length > 0) {
                // if subtasks are found, delete all subtasks.
                for(task of tasks) {
                  turbo.removeEntity('task', task.id);
                }

              }

              //finally delete the task!
              return turbo.removeEntity('task', body['task']);
            })
            .then(data => {
              resolve(data);
            })
            .catch(err => {
              reject(err)
            })
        }
    })
  }
}
