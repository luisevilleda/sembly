// bundle.js
const Promise = require('bluebird');

const Event = require('../../schemas/eventsSchema');
const User = require('../../schemas/userSchema');
const getEvents = require('./getEvents');

module.exports = (facebookId, location) => {
  let invited;
  let saved;
  let nearby;
  return User.findOne({ facebookId })
    .populate('invitedTo')
    .populate('saved')
    .exec()
    .then((user) => {
      invited = user.invitedTo;
      saved = user.saved;
      return getEvents(location);
    })
    .then((nearbyEvents) => {
      nearby = nearbyEvents;
      return Event.find({ hostId: facebookId });
    })
    .then((hostedEvents) => {
      return new Promise((resolve, reject) => {
        //Filter out repeats
        var uniqueEvents = {};
        hostedEvents.forEach((event) => {
          event.marking = 'public';
          uniqueEvents[event._id] = event;
        });
        invited.forEach((event) => {
          event.marking = 'invited';
          uniqueEvents[event._id] = event;
        });
        saved.forEach((event) => {
          event.marking = 'saved';
          uniqueEvents[event._id] = event;
        });
        nearby.forEach((event) => {
          event.marking = 'hosted';
          uniqueEvents[event._id] = event;
        });
        const results = [];
        for (var key in uniqueEvents) {
          results.push(uniqueEvents[key]);
        }
        resolve(results);
      });
  });
};
