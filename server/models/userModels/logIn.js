const rp = require('request-promise');
const checkStatus = require('../../requestHelpers');
const config = require('../../config');
const User = require('../../schemas/userSchema');

let decodedFacebookId;

module.exports = userData =>
  rp({
    uri: 'https://graph.facebook.com/v2.8/debug_token',
    qs: {
      input_token: userData.token,
      // ref: http://stackoverflow.com/a/19360136
      access_token: `${config.appId}|${config.appSecret}`,
    },
  })
  .then(checkStatus)
  .then(response => JSON.parse(response))
  .then(({ data }) => {
    decodedFacebookId = data.user_id;
    if (decodedFacebookId !== userData.facebookId) {
      throw new Error('Client-provided FacebookId doesn\'t match token');
    }
    const userDataFromClient = Object.assign({}, userData);
    delete userDataFromClient.facebookId;
    return User.findOneAndUpdate(
      {
        facebookId: decodedFacebookId,
      },
      userDataFromClient,
      {
        new: true,
        upsert: true,
      }
    )
    .populate('requests').exec();
  })
  .then(savedUser => savedUser)
  .catch(error => console.error('Error logging in user:', error.message));
