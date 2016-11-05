// addEvent
const Event = require('../../schemas/eventsSchema');
const User = require('../../schemas/userSchema');

module.exports = (event) => {
  const newEvent = new Event(event);
  return newEvent.save()
  .then((event) => {
  	return Promise.all(
  		event.invitedUsers.map( user => {
  			return addInvites(event._id, user)
  		})
  		)
  })
}



var addInvites = function(eventId, userId) {
	return User.findOneAndUpdate({
		'_id': userId
	}, {
		$push: {
			'invitedTo': eventId
		}
	}).exec();
}