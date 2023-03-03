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
   * Requests an access token from GitLab.
   *
   * @abstract
   * @param {string} code - The request code.
   * @returns {string} - The access token.
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

  /**
   * Gets the user info.
   *
   * @param {string} accessToken - The access token.
   * @returns {object} The user info (id, name, username, email, avatar, lastActivityOn)
   */
  async getUserInfo (accessToken) {
    throw new Error('Must be implemented by subclass!')
  }

  /**
   * Gets the user's activities from GitLab.
   *
   * @param {string} accessToken - The access token.
   * @returns {object[]} The activities ({ actionName: string, createdAt: string, targetTitle: string, targetType: string }).
   */
  async getActivities (accessToken) {
    throw new Error('Must be implemented by subclass!')
  }
}
