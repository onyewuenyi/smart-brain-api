

// TODO test
const handleRoot = (req, res, db) => {
  db('users').select('*')
  .then(users => res.json(users))
  .catch(err => res.status(400).json('Error accessing database'));
}


module.exports = {
  handleRoot: handleRoot
}
