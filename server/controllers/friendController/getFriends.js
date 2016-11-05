// getFriends.js
const friendModels = require('../../models/friendModels');

module.exports = (req, res) => {
  if (!req.body.facebookId) {
    return res.status(400).send('Invalid Input');
  }
  return friendModels.getFriends(req.body.facebookId, req.body.search)
    .then(user => res.status(200).send(user.friends))
    .catch(error => res.status(400).send('Error getting friends:', error.message));
};
