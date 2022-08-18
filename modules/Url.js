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
    console.log(this);
  }
  /**
   * Tests to see if the user owns this url or not.
   * @param {object} user The user object to check against ownership
   * @returns bool
   */
  isOwnedBy(user) {
    return this.owner === user.uid;
  }
  /**
   * Get the url for redirection and logs some details about its use
   * @param {object} request the get request
   * @returns {string} the long url for the website
   */
  getUrlForRedirection(request) {
    const ip = request.headers['x-forwarded-for'] || request.connection.remoteAddress;
    this.redirects++;
    if (!this.visitors[ip]) {
      this.visitors[ip] = 1;
      return this._url;
    }
    this.visitors[ip]++;
    return this._url;
  }
  /**
   * Getter for url without logging its use
   */
  get urlForInspection() {
    return this._url;
  }
  /**
   * Updates the current url to the new one provided
   * @param {string} url updated url to replace the old one
   */
  updateUrl(url) {
    this._url = url;
  }
}

module.exports = Url;