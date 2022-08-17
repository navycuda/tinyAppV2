const { generateNewKey } = require("./helpers");
const bcrypt = require('bcryptjs');


class User {
  constructor(email, database) {
    this.uid = generateNewKey(6, database);
    this._dB = database;
    this.email = email;
  }
  correctPassword(password) {
    bcrypt.compare(password, this._password)
      .then((result) => {
        return result;
      });
  }
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
}

module.exports = User;