const { generateNewKey } = require("./helpers");

class User {
  constructor(email, password, database) {
    this.uid = generateNewKey(6, database);
    this.email = email;
    this.password = password;
  }
}

module.exports = User;