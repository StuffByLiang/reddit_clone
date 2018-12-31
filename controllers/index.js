const RoomController = require('./RoomController');
const ReplyController = require('./ReplyController');
const TopicController = require('./TopicController');
const UserController = require('./UserController');

module.exports = {
  room: RoomController,
  reply: ReplyController,
  topic: TopicController,
  user: UserController
};