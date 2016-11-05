const User = require('../../schemas/userSchema');

module.exports = facebookId =>
  User.findOne({ facebookId })
    .populate('requests')
    .exec();
