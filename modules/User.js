const { generateNewKey } = require("./helpers");

class User {
  constructor(database, username, email, password) {
    this.uid = generateNewKey(6, database);
    this.username = username;
    this.email = email;
    this.password = password;
  }
  getUrls(database) {
    const urls = {};
    for (let key in database) {
      if (database[key].userID === this.uid) {
        urls[key] = database[key];
      }
    }
    return urls;
  }
}

module.exports = User;