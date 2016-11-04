const userModels = require('../../models/userModels');

module.exports = (req, res) => {
  console.log('hello!');
  //const email = req.body.email;
  //const password = req.body.password;
  const email = 'spencer@test.com';
  const password = 'test';
  userModels.logIn(email, password)
    .then((response) => {
      console.log('yay!');
      res.status(200).json(response);
    })
    .catch((error) => {
      console.log('oh no, error in login method!!');
      console.log(error);
      console.log(error.message);
      res.status(400).json({ message: error.message });
    });
};
