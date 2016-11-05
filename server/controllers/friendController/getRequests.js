// getRequests.js

const friendModels = require('../../models/friendModels');

module.exports = (req, res) => {
  if (!req.body.facebookId) {
    return res.status(400).send('Invalid Input');
  }
  return friendModels.getRequests(req.body.facebookId)
    .then(user => res.status(200).send(user.requests))
    .catch(error => res.status(400).send('Error getting friend requests:', error.message));
};
