const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const PORT = process.env.PORT || 5000;

// imported  controller files
const register = require('./controllers/register');
const root = require('./controllers/root');
const signin = require('./controllers/signin');
const profile_id = require('./controllers/profile_id');
const image = require('./controllers/image');
const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'charlesonyewuenyi',
    password : '',
    database : 'smart-brain'
  }
});
const app = express();

// middleware used to parse body of the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

// FIXME REFRACTOR
// This hash of codes can go into a static config file
const err_codes = {
  success: 200,
  notFound: 404,
  badRequest: 400
}

// FIXME REFRACTOR
// This can go into a general sever_utils.js file
addNewUser = (reqBody, res) => {
  // Add a new user to the database with knex API
  // Mutates the state of the database
  const {email, name, password, id } = reqBody
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



app.get('/', (req, res) => root.handleRoot(req, res, db));


app.get('/profile/:id', (req, res) => profile_id.handleProfileGet(req, res, db));


app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));


app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));


app.put('/image', (req, res) => image.handleImage(req, res, db));


app.post('/imageurl', (req, res) => image.handleAPICall(req, res));

app.listen(PORT, () => console.log(`app is running on port ${PORT}`));



// General to every express sever implementation
//TODO implement a create-express-sever cli, similar to create-react-app
// Description: abstract infrastructure setup and let user focus on design.
// implementation, and testing of the logic

// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// app.listen(3000);
