var eventModels = require('../../models/eventModels');

module.exports = (req, res) => {
  if (!req.body.location || !req.body.name) {
    return res.status(400).send('Invalid Input');
  }
  eventModels.addEvent(req.body)
	.then( success => {
		res.sendStatus(201);
	})
	.catch( error => {
		console.log(error);
		res.status(400).send('An error occured');
	})
}