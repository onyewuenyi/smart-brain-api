const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const PORT = process.env.PORT || 5000;
const environment = process.env.NODE_ENV || 'development';

// imported  controller files
const register = require('./controllers/register');
const home = require('./controllers/home');
const signin = require('./controllers/signin');
const profile_id = require('./controllers/profile_id');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_URL,
    ssl: true,
  }
});
const app = express();

// middleware used to parse body of the request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());


app.get('/', (req, res) => home.handleRoot(req, res, db));


app.get('/profile/:id', (req, res) => profile_id.handleProfileGet(req, res, db));


app.post('/signin', (req, res) => signin.handleSignin(req, res, db, bcrypt));


app.post('/register', (req, res) => register.handleRegister(req, res, db, bcrypt));


app.put('/image', (req, res) => image.handleImage(req, res, db));


app.post('/imageurl', (req, res) => image.handleAPICall(req, res));


app.listen(PORT, () => console.log(`app is running on port ${PORT}`));



// General to every express server implementation
//TODO implement a create-express-server cli, similar to create-react-app
// Description: abstract infrastructure setup and let user focus on design.

// const express = require('express');
// const bodyParser = require('body-parser');
// const bcrypt = require('bcrypt-nodejs');
// const app = express();
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({extended: false}));
// app.listen(PORT);
