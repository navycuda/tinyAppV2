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
  getUidByUsername,
  getUserByRequest,
  getUidByEmail
} = require('./modules/helpers');

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

// get - index of urls, accessible only to logged in user
app.get('/urls', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  if (!user) {
    // Create an error page... handle this error
    response.status(400).render('error');
    return;
  }
  //  if not the user, make them login
  response.send('get urls');
});
app.post('/urls', (request, response) => {

});

app.get('/login', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  console.log(user);
  if (!user) {
    const templateVars = { title: 'User Login', submitName: 'Login' };
    response.render('user_login', templateVars);
    return;
  }
  response.status(400).render('error');
  // response.send('get login');
});

// Error handling
app.get('*', (request, response) => {

});

/**
 * Start the Server
 */
app.listen(PORT, () => {
  console.log(`TinyAPP server running on port ${PORT}`);
});