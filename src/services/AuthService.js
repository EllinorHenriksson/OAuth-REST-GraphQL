import fetch from 'node-fetch'
import createError from 'http-errors'

/**
 * Represents an AuthService.
 */
export class AuthService {
  /**
   * Requests an access token from GitLab.
   *
   * @throws {Error} Throws an exception if the request fails.
   * @param {string} code - The request code.
   * @returns {string} - The access token.
   */
  async requestAccessToken (code) {
    const response = await fetch(`https://gitlab.lnu.se/oauth/token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.CALLBACK}`, { method: 'POST' })

    if (!response.ok) {
      throw createError(response.status, response.statusText)
    }

    const { access_token: accessToken } = await response.json()

    return accessToken
  }

  /**
   * Revokes the access token for the GitLab user.
   *
   * @throws {Error} Throws an exception if the request fails.
   * @param {string} accessToken - The access token.
   */
  async revokeAccessToken (accessToken) {
    const response = await fetch(`https://gitlab.lnu.se/oauth/revoke?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&token=${accessToken}`, { method: 'POST' })

    if (response.status !== 200) {
      throw new Error(`Unable to revoke token. Fetch response: ${response.status} ${response.statusText}`)
    }
  }
}
