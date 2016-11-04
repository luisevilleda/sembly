const Promise = require('bluebird');
const User = require('../../schemas/userSchema');

let thisUser;

// Add a new user to the database
module.exports = (email, password) => (
  User.findOne({
    email,
  })
  .populate('requests').exec()
  .then((user) => {
    if (!user) {
      throw new Error(`User (${email}) does not exist`);
    }
    thisUser = user;
    return user.comparePasswords(password);
  })
  .then((match) => {
    if (!match) {
      throw new Error('Incorrect password');
    }

    return thisUser;
  })
);
