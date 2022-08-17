/**
 * Required
 */
// Server console logging middleware
const morgan = require('morgan');
// Server framework
const express = require('express');
const app = express();
// Cookies and their encryption
const bcrypt = require('bcryptjs');
const cookieSession = require('cookie-session');
// Pathing middleware
const methodOverride = require('method-override');
// Simulated Database
const dB = require('./modules/database');
// Helper functions
const {
  generateNewKey,
  getUserByRequest,
  getUserByEmail
} = require('./modules/helpers');
// Classes
const Url = require('./modules/Url');
const User = require('./modules/User');

/**
 * TCP:HTTP
 */
const PORT = 8080;

/**
 * Activate Middleware
 */
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(cookieSession({
  name: "enigmaSecure",
  keys: [ 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', 'BDFHJLCPRTXVZNYEIWGAKMUSQO' ]
}));
app.use(methodOverride('_method'));
// Setup the template engine, ejs
app.set('view engine', 'ejs');

/**
 * Manage End Points
 */
// get - Root of site
app.get('/', (request, response) => {
  // Get the user via session
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    response.redirect('/login');
    return;
  }
  response.redirect('/urls');
});


// u/:id
app.get('/u/:id', (request, response) => {
  const id = request.params.id;
  const url = dB.urls[id];
  if (!url) {
    response.status(404).render('error');
    return;
  }
  response.redirect(url.getUrlForRedirection(request));
});


// urls
app.get('/urls', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    response.status(400).render('error');
    return;
  }
  response.send('get urls');
});

app.post('/urls', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    response.status(400).render('error');
    return;
  }
});


// urls/new
app.get('/urls/new', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    response.status(400).render('error');
    return;
  }
});


// urls/:id
app.get('/urls/:id', (request, response) => {
  const id = request.params.id;
  const url = dB.urls[id];
  if (!url) {
    response.status(404).render('error');
    return;
  }
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    response.status(400).render('error');
  }
});

app.put('/urls/:id', (request, response) => {
  const id = request.params.id;
  const url = dB.urls[id];
  if (!url) {
    response.status(404).render('error');
    return;
  }
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    response.status(404).render('error');
    return;
  }
  if (!url.isOwnedBy(user)) {
    response.status(400).render('error');
    return;
  }
  const updatedUrl = request.body.updatedUrl;
  url.updateUrl(updatedUrl);
  response.redirect('/urls');
});

app.delete('/urls/:id/delete', (request, response) => {
  const id = request.params.id;
  const url = dB.urls[id];
  if (!url) {
    response.status(404).render('error');
    return;
  }
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    response.status(400).render('error');
    return;
  }
  if (!url.isOwnedBy(user)) {
    response.status(400).render('error');
    return;
  }
  delete dB.urls[id];
  response.redirect('/urls');
});


// login
app.get('/login', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  if (user) {
    response.redirect('/urls');
    return;
  }
  const templateVars = { title: 'User Login', submitName: 'Login' };
  response.render('user_login', templateVars);
  return;
});

app.post('/login', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const user = getUserByEmail(email, dB.users);
  if (!user || !email || !password) {
    response.status(400).render('error');
    return;
  }
  if (!user.correctPassword(password)) {
    response.status(400).render('error');
    return;
  }
  request.session.uid = user.uid;
  response.redirect('/urls');
});


// Logout
app.delete('/logout', (request, response) => {
  request.session = null;
  response.redirect('/urls');
});


// Register
app.get('/register', (request, response) => {
  const user = getUserByRequest(request);
  if (user) {
    response.redirect('/urls');
    return;
  }
  const templateVars = { title: 'User Registration', submitName: 'Register' };
  response.render('user_login', templateVars);
});

app.post('/register', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  let isUser = getUserByEmail(email);
  if (isUser || !email || !password) {
    response.status(400).render('error');
    return;
  }
  const user = new User(email, dB.users);
  user.setPassword(password);
  response.redirect('/urls');
});

// Error handling
app.get('*', (request, response) => {
  response.status(404).render('error');
});

/**
 * Start the Server
 */
app.listen(PORT, () => {
  console.log(`TinyAPP server running on port ${PORT}`);
});