const { generateNewKey } = require("./helpers");
const bcrypt = require('bcryptjs');


class User {
  constructor(email, password, database) {
    this.uid = generateNewKey(6, database);
    this.email = email;
    this.password = password;
  }
  correctPassword(password) {
    bcrypt.compare(password, this.password)
      .then((result) => {
        return result;
      });
  }
}

module.exports = User;