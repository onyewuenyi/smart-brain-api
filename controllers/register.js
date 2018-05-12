
const isInputDataValid = (email, name, password) => {
  // client server validation
  if(!email || !name || !password) {
    return false;
  }
  else {
    return true;
  }
}


const handleRegister = (req, res, db, bcrypt) => {
  console.log('Executing handleRegister');

  const addNewUser = (reqBody) => {
    // Add a new user to the database with knex API
    // Mutates the state of the database
    const {email, name, password, id } = reqBody;
    console.log('Executing addNewUser');


    if(! isInputDataValid(email, name, password)) {
      return res.status(400).json('incorrect form submission');
    }

    const hash = bcrypt.hashSync(password);  // bcrypt the user password

    // create a relational database transction to allow correct recovery
    // from failures and keep a database consisten even in case of a
    // system failure, enables robustness of a DB
    db.transaction(trx => {
      // insert hash and email into login table and return res email data
      trx.insert({ hash: hash, email: email })
      .into('login')
      .returning('email') // return login email to be used in users table action
      .then(loginEmail => {
        const new_user = {
          email: loginEmail[0],
          name: name,
          joined: new Date()
        }

        return trx('users').returning('*').insert(new_user).then(user => res.json(user[0]));
      })
      .then(trx.commit) // if all opeation pass then send this transaction
      .catch(trx.rollback) // if not then jump back to the initial state
    })
    .catch(err => res.status(400).json('unable to register'));
  }


  // create and add a new user to the database
  // the set of database operations are wrapped within a transaction
  addNewUser(req.body);
}


// export function in a file
module.exports = {
  handleRegister: handleRegister
}
