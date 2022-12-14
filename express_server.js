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
    const templateVars = {
      user: null,
      errorMsg: 'url does not exist'
    };
    response.status(404).render('error', templateVars);
    return;
  }
  response.redirect(url.getUrlForRedirection(request));
});


// urls
app.get('/urls', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  const templateVars = { user };
  if (!user) {
    templateVars.errorMsg = 'Not logged in';
    response.status(400).render('error', templateVars);
    return;
  }
  const urls = user.getUrls(dB.urls);
  templateVars.urls = urls;
  response.render('index', templateVars);
});

app.post('/urls', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  const templateVars = { user };
  if (!user) {
    templateVars.errorMsg = 'Not logged in';
    response.status(400).render('error', templateVars);
    return;
  }
  // Url adds itself to the database after construction
  new Url(request.body.fullUrl, user.uid, dB.urls, (id) => {
    response.redirect(`/urls/${id}`);
  });
});


// urls/new
app.get('/urls/new', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  const templateVars = {
    user,
    title: 'Create Url',
    submitName: 'Create',
    action: '/urls',
    method: 'POST',
    fullUrl: ''
  };
  if (!user) {
    templateVars.errorMsg = 'Not logged in';
    response.status(400).render('error', templateVars);
    return;
  }
  response.render('url_edit', templateVars);
});


// urls/:id
app.get('/urls/:id', (request, response) => {
  const id = request.params.id;
  const url = dB.urls[id];
  const user = getUserByRequest(request, dB.users);
  const templateVars = {
    user,
    title: 'Edit Url',
    submitName: 'Edit',
    method: 'POST',
    action: `/urls/${id}?_method=PUT`,
    fullUrl: url.urlForInspection
  };
  if (!user) {
    templateVars.errorMsg = 'Not logged in';
    response.status(400).render('error', templateVars);
    return;
  }
  if (!url) {
    templateVars.errorMsg = 'Url does not exist';
    response.status(404).render('error', templateVars);
    return;
  }
  if (!url.isOwnedBy(user)) {
    templateVars.errorMsg = 'Not owner of this url.';
    response.status(400).render('error', templateVars);
  }
  response.render('url_edit', templateVars);
});

app.put('/urls/:id', (request, response) => {
  const id = request.params.id;
  const url = dB.urls[id];
  const user = getUserByRequest(request, dB.users);
  const templateVars = { user };
  if (!user) {
    templateVars.errorMsg = "Not logged in.";
    response.status(400).render('error', templateVars);
    return;
  }
  if (!url) {
    templateVars.errorMsg = "Url does not exist";
    response.status(404).render('error', templateVars);
    return;
  }
  if (!url.isOwnedBy(user)) {
    templateVars.errorMsg = 'Not owner of this url.';
    response.status(400).render('error', templateVars);
    return;
  }
  const updatedUrl = request.body.fullUrl;
  url.updateUrl(updatedUrl);
  response.redirect(`/urls`);
});

app.delete('/urls/:id/delete', (request, response) => {
  const id = request.params.id;
  const url = dB.urls[id];
  const user = getUserByRequest(request, dB.users);
  const templateVars = { user };
  if (!user) {
    templateVars.errorMsg = "Not logged in.";
    response.status(400).render('error', templateVars);
    return;
  }
  if (!url) {
    templateVars.errorMsg = "Url does not exist";
    response.status(404).render('error', templateVars);
    return;
  }
  if (!url.isOwnedBy(user)) {
    templateVars.errorMsg = 'Not owner of this url.';
    response.status(400).render('error', templateVars);
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
  const templateVars = {
    user,
    title: 'User Login',
    submitName: 'Login',
    action: '/login',
    method: 'POST'
  };
  response.render('user_login', templateVars);
  return;
});

app.post('/login', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  const user = getUserByEmail(email, dB.users);
  const templateVars = {
    user,
    errorMsg: 'Error Logging in, username or password incorrect.'
  };
  if (!user || !email || !password) {
    response.status(400).render('error', templateVars);
    return;
  }
  user.correctPassword(password, (isValid) => {
    if (!isValid) {
      templateVars.user = null;
      response.status(400).render('error', templateVars);
      return;
    }
    request.session.uid = user.uid;
    response.redirect('/urls');
  });
});


// Logout
app.delete('/logout', (request, response) => {
  request.session = null;
  response.redirect('/urls');
});


// Register
app.get('/register', (request, response) => {
  const user = getUserByRequest(request, dB.users);
  if (user) {
    response.redirect('/urls');
    return;
  }
  const templateVars = {
    user: null,
    title: 'User Registration',
    submitName: 'Register',
    action: '/register',
    method: 'POST'
  };
  response.render('user_login', templateVars);
});

app.post('/register', (request, response) => {
  const email = request.body.email;
  const password = request.body.password;
  let isUser = getUserByEmail(email, dB.users);
  if (isUser || !email || !password) {
    const templateVars = {
      user: null,
      errorMsg: 'Registration error, please try again.'
    };
    response.status(400).render('error', templateVars);
    return;
  }
  const user = new User(email, dB.users);
  // setPassword adds user to the dB
  user.setPassword(password, () => {
    request.session.uid = user.uid;
    response.redirect('/urls');
  });
});

// Error handling
app.get('*', (request, response) => {
  const templateVars = {
    user: null,
    errorMsg: 'Url not found.'
  };
  response.status(404).render('error', templateVars);
});
app.post('*', (request, response) => {
  const templateVars = {
    user: null,
    errorMsg: 'Url not found.'
  };
  response.status(404).render('error', templateVars);
});

/**
 * Start the Server
 */
app.listen(PORT, () => {
  console.log(`TinyAPP server running on port ${PORT}`);
});