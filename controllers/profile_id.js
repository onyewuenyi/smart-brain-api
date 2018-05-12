const handleProfileGet = (req, res, db) => {
  const { id } = req.params;
  // check if id is in database and return user if found
  // const idIsInDatabase = (database, id) => {
  //   let userFound = false;
  //
  //   database.users.forEach(user => {
  //     if(Number(user.id) === Number(id)) {
  //       found = true;
  //       // break loop when the user is found
  //       // We dont want to continue searching when we already found the user
  //       return res.json(user);
  //     }
  //   });
  //   if(!userFound) {
  //     res.status(err_codes.notFound).json('no such user');
  //   }
  // }
  // idIsInDatabase(database, Number(id));
  db.select('*').from('users')
  .where({id})
  .then(user => {
    // check for an empty list of objects: user.length)
    if(user.length) {
      res.json(user[0])
    }
    else {
      res.status(400).json('Not found');
    }
  })
  .catch(err => res.status(400).json('Error getting user'));

}

module.exports = {
  handleProfileGet: handleProfileGet
}
