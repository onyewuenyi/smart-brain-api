const Clarifai = require('clarifai');

// App configuration
const app = new Clarifai.App({
 apiKey: 'b3bdc50133984b6bac23895667f11bd0'
});

// TODO this refractor
// const handleAPICall = async (req, res) => {
//   try {
//     const { input } = req.body;
//     const clarifaiResponse = await app.models.predict(Clarifai.FACE_DETECT_MODEL, input);
//     const boundingBoxData =  res.json(clarifaiResponse);
//     return boundingBoxData;
//   }
//   catch(err) {
//     res.status(400).json('unable to work with api'));
//   }
// }

const handleAPICall = (req, res) => {
  const { input } = req.body;
  app.models.predict(Clarifai.FACE_DETECT_MODEL, input)
  .then(data => res.json(data))
  .catch(err => res.status(400).json('unable to work with api'));
}

const isIdInDB = (res, id, db) => {
  // if the user is found then increment entries for the user

  // if the user with the specified id is present in the database then
  // inc entries for that user
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => res.json(entries[0]))
  .catch(err => res.status(400).json(`unable The user with ${id} not found`));
}


const handleImage = (req, res, db) => {
  // '/image' endpoint expressed in express
  const { id } = req.body;

  // update entries if the id is found
  isIdInDB(res, Number(id), db);
}


module.exports = {
  handleImage : handleImage,
  handleAPICall: handleAPICall
}
