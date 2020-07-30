const ta = require('time-ago')
const Room = require('../../../../../models/Room')
const Topic = require('../../../../../models/Topic')
const Reply = require('../../../../../models/Reply')

//fetch from database room with slug that matches the paramater 'slug'
module.exports = function(req, res, config, slug, topicSlug) {
  Room.find({
    slug: slug
  }).sort({'timestamp': 'desc'}).lean()
    .then(rooms => {
      if(rooms.length > 0) {
        //if found within the database, continue on

        config.roomDetails = {
          name: rooms[0].category,
          slug: rooms[0].slug,
          description: rooms[0].description,
          subscribers: rooms[0].subscribers.length
        }

        // get the topic from the room
        return Topic.find({slug: topicSlug}).sort({'timestamp': 'desc'}).lean()

      } else if(rooms.length === 0) {
        //if there are no results, tell client the room was not found
        res.json({
          confirmation: 'fail',
          data: 'Room not found: ' + slug
        })
      }
    })
    .then(topics => {
      if(topics.length > 0) {
        //if found within the database, render the room
        config['topic'] = topics[0];
        config['pageTitle'] = topics[0].room.name + " > " + topics[0].title;

        // convert date time into FORMAT ___ units ago
        config.topic.timestamp = ta.ago(config.topic.timestamp);

        // now get top-level replys
        return Reply.find({
          type: 'first-level',
          topicSlug: topicSlug
        }).sort({'timestamp': 'desc'}).lean()

      } else if(topics.length === 0) {
        //if there are no results, tell client the room was not found
        res.json({
          confirmation: 'fail',
          data: 'Topic not found: ' + topicSlug
        })
      }
    })
    .then(replys => {

      // convert date time into FORMAT ___ units ago
      for(reply of replys) {
        reply.timestamp = ta.ago(reply.timestamp);
      }

      config.replys = replys;

      // now get second-level replys
      return Reply.find({
        type: 'second-level',
        topicSlug: topicSlug
      }).sort({'timestamp': 'desc'}).lean()

    })
    .then(replys => {
      // add the reply to the config replys

      // initialize the array
      for(firstLevelReply of config.replys) {
        firstLevelReply.replys = [];
      }

      // convert date time into FORMAT ___ units ago
      for(reply of replys) {
        reply.timestamp = ta.ago(reply.timestamp);
      }

      for(secondLevelReply of replys) {
        for(firstLevelReply of config.replys) {
          if(firstLevelReply._id == secondLevelReply.to.replyId) {
            firstLevelReply.replys.push(secondLevelReply)
            console.log(secondLevelReply)
          }
        }
      }

      // after done, reverse array of replys to show latest first
      for(firstLevelReply of config.replys) {
        firstLevelReply.replys = firstLevelReply.replys.reverse();
      }

      res.render('topic', config) // finally render everything
    })
    .catch(err => {
      res.json({
        confirmation: 'fail',
        data: err.message
      })
    })
}
