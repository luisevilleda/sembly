// getBundle.js
const eventModels = require('../../models/eventModels');

module.exports = (req, res) => {
	if (!req.body.location || !req.body.facebookId) {
		return res.status(400).send('Invalid Input');
	}
	eventModels.bundle(req.body.facebookId, req.body.location)
	.then( events => {
		res.status(200).send(events);
	})
	.catch( error => {
		console.log(error);
		res.status(400).send('An error occured');
	})
}
