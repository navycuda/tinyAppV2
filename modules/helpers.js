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
// Using session, gets the correct user from the database
const getUserByRequest = (request, database) => {
  const uid = request.session.uid;
  const user = uid ? database[uid] : null;
  if (!uid) {
    request.session = null;
  }
  return user;
};
/**
 * Searches for a user by their email address
 * @param {string} email the users email address
 * @param {object} database the database to search
 * @returns user || null
 */
const getUserByEmail = (email, database) => {
  for (let key in database) {
    if (database[key].email === email) {
      return database[key];
    }
  }
  return null;
};

/* Exports */
module.exports = {
  generateNewKey,
  getUserByRequest,
  getUserByEmail: getUserByEmail
};