const { generateNewKey } = require("./helpers");
const bcrypt = require('bcryptjs');


class User {
  /**
   * Creates the User object
   * @param {string} email The users email address
   * @param {object} database The database this user is stored in
   */
  constructor(email, database) {
    this.uid = generateNewKey(6, database);
    this._dB = database;
    this.email = email;
  }
  /**
   * Checks to see if the supplied password matchs
   * the password on record
   * @param {string} password the form submitted password
   * @returns {boolean} does the password match?
   */
  correctPassword(password, callback) {
    bcrypt.compare(password, this._password)
      .then((result) => {
        callback(result);
      });
  }
  /**
   * This method sets the password, and adds the user
   * to the dB if they're not already part of it.
   * @param {*} password the password to be assigned to the user
   */
  setPassword(password) {
    bcrypt.genSalt(10)
      .then((salt) => {
        return bcrypt.hash(password, salt);
      })
      .then((hash) => {
        this._password = hash;
        if (!this._dB[this.uid]) {
          this._dB[this.uid] = this;
        }
      });
  }
  getUrls(urlDatabase) {
    const result = {};
    for (const key in urlDatabase) {
      const url = urlDatabase[key];
      if (url.isOwnedBy(this)) {
        result[url.id] = url;
      }
    }
    return result;
  }
}

module.exports = User;