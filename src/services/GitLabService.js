import { ServiceBase } from './ServiceBase.js'
import fetch from 'node-fetch'
import createError from 'http-errors'

/**
 * Represents a GitLabService.
 */
export class GitLabService extends ServiceBase {
  /**
   * Requests an access token from GitLab.
   *
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
   * Gets the user info.
   *
   * @param {string} accessToken - The access token.
   * @returns {object} The user info (id, name, username, email, avatar, lastActivityOn)
   */
  async getUserInfo (accessToken) {
    const response = await fetch(`https://gitlab.lnu.se/api/v4/user?access_token=${accessToken}`)

    if (!response.ok) {
      console.log('Response: ', response)
      throw new Error('Failed to fetch user info.')
    }

    const { id, name, username, email, avatar_url: avatar, last_activity_on: lastActivityOn } = await response.json()

    return { id, name, username, email, avatar, lastActivityOn }
  }

  /**
   * Revokes the access token for the GitLab user.
   *
   * @param {string} accessToken - The access token.
   */
  async revokeAccessToken (accessToken) {
    const response = await fetch(`https://gitlab.lnu.se/oauth/revoke?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&token=${accessToken}`, { method: 'POST' })

    if (response.status !== 200) {
      throw new Error(`Unable to revoke token. Fetch response: ${response.status} ${response.statusText}`)
    }
  }
}
