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
  // if logged in, send to /urls
  // else, send to  /login
  response.redirect('/urls');
});

app.get('/urls', (request, response) => {
  // Get the user via session
  //  if not the user, make them login
});
app.post('/urls', (request, response) => {

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