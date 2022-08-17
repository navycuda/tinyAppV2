/* Require */
const { getRandomAlphanumericString } = require('@navycuda/lotide');

/**
 * Generates a new key, checks the database to ensure
 * it doesn't already exist.
 * @param {number} length the length of the keystring
 * @param {object} comparisonData object of objects database
 * @returns {string} random, unused key
 */
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