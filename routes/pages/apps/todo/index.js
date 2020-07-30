const helpers = require('../../../helpers');
const Task = require('../../../../models/Task')

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {
  const user = req.params.user;

	config = {
		cdn: CDN,
		pageTitle: 'Todo List'
	};

  if(req.session == null || req.session.user == null) {
    //redirect if not logged in
    res.redirect('/');
  } else {
    // get all first-level tasks that has the id of the user data
    Task.find({
      'user.id': req.session.user.id,
      type: 'first-level'
    })
			.then(tasks => {
				config['tasks'] = tasks; // set the tasks config variable to the tasks in the database

        // reverse tasks to show oldest first
        config.tasks = config.tasks.reverse();

        // now get second-level tasks

        return Task.find({
          type: 'second-level'
        })
			})
      .then(tasks => {
        // add the second level tasks to the config tasks

        // initialize the array subtasks
        for(firstLevelTask of config.tasks) {
          firstLevelTask.subtasks = [];
          firstLevelTask.checked = (firstLevelTask.checked === 'true'); //convert string true to bool
        }

        // add the second-level tasks to the corresponding first-level task
        for(secondLevelTask of tasks) {
          secondLevelTask.checked = (secondLevelTask.checked === 'true'); //convert string true to bool
          for(firstLevelTask of config.tasks) {
            if(firstLevelTask.id == secondLevelTask.task) {
              firstLevelTask.subtasks.push(secondLevelTask);
            }
          }
        }

        // after done, reverse array of subtasks to show oldest first
        for(firstLevelTask of config.tasks) {
          firstLevelTask.subtasks = firstLevelTask.subtasks.reverse();
        }

        // finally display page
				helpers.displayPage(req, res, 'apps-todo', config);
      })
			.catch(err => {
        console.log(err)
				res.render('apps-todo', config);
			})
  }

}
