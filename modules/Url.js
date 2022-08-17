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
    this._url = url;
    this.owner = uid;
    this.createdAt = Date.now();
    this.visitors = {};
    this.redirects = 0;
  }
  /**
   * Tests to see if the user owns this url or not.
   * @param {object} user The user object to check against ownership
   * @returns bool
   */
  isOwnedBy(user) {
    return this.owner === user.uid;
  }
  getUrlForRedirection(request) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    if (!this.visitors[ip]) {
      this.visitors[ip] = 1;
    } else {
      this.visitors[ip]++;
    }
    this.redirects++;
    return this._url;
  }
  get urlForInspection() {
    return this._url;
  }
}