const turbo = require('turbo360')({site_id: process.env.TURBO_APP_ID})
const helpers = require('../../../helpers');

const CDN = (process.env.TURBO_ENV == 'dev') ? '' : process.env.TURBO_CDN;

module.exports = (req, res) => {
  const user = req.params.user;

	config = {
		cdn: CDN,
		pageTitle: 'Todo List'
	};

  if(req.vertexSession == null || req.vertexSession.user == null) {
    //redirect if not logged in
    res.redirect('/');
  } else {
    // get all first-level tasks that has the id of the user data
    turbo.fetch('task', {
      'user.id': req.vertexSession.user.id,
      type: 'first-level'
    })
			.then(tasks => {
				config['tasks'] = tasks; // set the tasks config variable to the tasks in the database

        // reverse tasks to show oldest first
        config.tasks = config.tasks.reverse();

        // now get second-level tasks

        return turbo.fetch('task', {
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
