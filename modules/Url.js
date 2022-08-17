const { generateNewKey } = require("./helpers");


class Url {
  /**
   * Url object for database
   * @param {string} url The url to be shortened
   * @param {string} uid The user id of the url owner
   * @param {object} database The database this url will live
   */
  constructor(url, uid, database) {
    this.id = generateNewKey(6, database);
    this.url = url;
    this.owner = uid;
  }
}