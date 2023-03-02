/**
 * Represents an abstract ServiceBaseClass.
 *
 * @abstract
 */
export class ServiceBase {
  /**
   * Initializing constructor.
   */
  constructor () {
    // Makes the class abstract
    if (this.constructor === ServiceBase) {
      throw new Error('Class "ServiceBase" can not be instantiated.')
    }
  }

  /**
   * Requests an access token from GitLab and returns the token and some user info.
   *
   * @abstract
   * @param {string} code - The request code.
   * @returns {object} - An object with properties accessToken (string) and user (object { id (string), email (string), groups (string[])})
   */
  async requestAccessToken (code) {
    throw new Error('Must be implemented by subclass!')
  }

  /**
   * Revokes the access token for the GitLab user.
   *
   * @abstract
   * @param {string} accessToken - The access token.
   */
  async revokeAccessToken (accessToken) {
    throw new Error('Must be implemented by subclass!')
  }
}
