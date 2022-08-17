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