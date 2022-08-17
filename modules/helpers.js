/* Require */
const { getRandomAlphanumericString } = require('@navycuda/lotide');

/* Export Functions */
// Generates a random string with the specified length.
// the comparison data is an object of objects, check
// the key doesn't exist already
const generateNewKey = (length, comparisonData) => {
  let isDefined = true;
  let result;
  while (isDefined) {
    result = getRandomAlphanumericString(length);
    if (!comparisonData[result]) {
      isDefined = false;
    }
  }
  return result;
};
// Searches database for the username and returns the
// user id.
const getUidByUsername = (username, database) => {
  for (let key in database) {
    if (database[key].username === username) {
      return database[key].uid;
    }
  }
  return null;
};
// Using session, gets the correct user from the database
const getUserByRequest = (request, database) => {
  const uid = request.session.uid;
  const user = uid ? database[uid] : null;
  if (!uid) {
    request.session = null;
  }
  return user;
};
// Searches database by email for the correct user id.
const getUidByEmail = (email, database) => {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key].uid;
    }
  }
  return null;
};

/* Exports */
module.exports = {
  generateNewKey,
  getUidByUsername,
  getUserByRequest,
  getUidByEmail
};