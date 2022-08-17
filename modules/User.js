const { generateNewKey } = require("./helpers");
const bcrypt = require('bcryptjs');


class User {
  constructor(email, database) {
    this.uid = generateNewKey(6, database);
    this.email = email;
  }
  correctPassword(password) {
    bcrypt.compare(password, this.password)
      .then((result) => {
        return result;
      });
  }
  setPassword(password) {


    return 'hashed password should be here';
  }
  isCorrect(password) {

    
    return false;
  }
}

module.exports = User;