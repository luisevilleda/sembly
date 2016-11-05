const User = require('../../schemas/userSchema');

module.exports = (facebookId, search = '') =>
  User.findOne({ facebookId })
    .populate({
      path: 'friends',
      match: {
        $or: [
          { email: new RegExp(search, 'i') },
          { firstName: new RegExp(search, 'i') },
          { lastName: new RegExp(search, 'i') },
        ],
      },
    })
  .exec();
