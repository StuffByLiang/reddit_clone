const Promise = require('bluebird');
const Task = require('../models/Task');
const User = require('../models/User');
const resource = 'task';

module.exports = {
  get: (params) => {
    return new Promise((resolve, reject) => {
      Task.find(params)
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
      Task.findById(id)
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
        // not logged in
          reject({message: "Not logged in. Cannot add task."})
      } else {
        // logged in!

        // get user data
        User.findById(req.session.user.id)
          .then(user => {
            body['user'] = {
              id: user._id,
              username: user.username
            }

            body.type = 'first-level';
            body.checked = false;

            return Task.create(body)
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
          reject({message: "Not logged in. Cannot add subtask."})
        } else {
          // logged in!

          //check if first level task exists
          Task.findById(body['task'])
            .then(task => {
              // Now fetch topic
               return User.findById(req.session.user.id);
            })
            .then(user => {
              body['user'] = {
                id: user.id,
                username: user.username
              }

              body.type = "second-level";
              body.checked = false;

              return Task.create(body);
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
      if(req.session == null || req.session.user == null) {
          reject({message: "Not logged in. Cannot check/uncheck."})
        } else {
          // logged in!

          //update entity
          Task.findByIdAndUpdate(body['id'], {
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
      if(req.session == null || req.session.user == null) {
          reject({message: "Not logged in. Cannot check/uncheck."})
        } else {
          // logged in!

          //get subtasks
          Task.find({
            task: body['task']
          })
            .then(tasks => {
              if(tasks.length > 0) {
                // if subtasks are found, delete all subtasks.
                for(task of tasks) {
                  Task.findByIdAndDelete(task._id);
                }

              }

              //finally delete the task!
              return Task.findByIdAndDelete(body['task']);
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
