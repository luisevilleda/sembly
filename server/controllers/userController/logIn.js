const userModels = require('../../models/userModels');

module.exports = (req, res) => {
  userModels.logIn(req.body)
    .then((user) => {
      res
        .status(200)
        .json(user);
    })
    .catch(error => res.status(400).json({ message: error.message }));
};
