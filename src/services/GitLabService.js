import { ServiceBase } from './ServiceBase.js'
import fetch from 'node-fetch'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

/**
 * Represents a GitLabService.
 */
export class GitLabService extends ServiceBase {
  /**
   * Requests an access token from GitLab.
   *
   * @param {string} code - The request code.
   * @returns {object} - The access token and the user id.
   */
  async requestAccessToken (code) {
    const response = await fetch(`https://gitlab.lnu.se/oauth/token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.CALLBACK}`, { method: 'POST' })

    if (!response.ok) {
      throw createError(response.status, response.statusText)
    }

    const { access_token: accessToken, id_token: idToken } = await response.json()
    const payload = jwt.decode(idToken, { json: true })

    return { accessToken, userId: payload.sub }
  }

  /**
   * Gets the user info.
   *
   * @param {string} accessToken - The access token.
   * @returns {object} The user info (id, name, username, email, avatar, lastActivityOn)
   */
  async getUserInfo (accessToken) {
    const response = await fetch(`https://gitlab.lnu.se/oauth/userinfo?access_token=${accessToken}`)

    if (!response.ok) {
      throw new Error('Failed to fetch user info.')
    }

    const data = await response.json()

    // Get last activity on

    return {
      id: data.sub,
      name: data.name,
      username: data.nickname,
      email: data.email,
      avatar: data.picture,
      lastActivityOn: 'date'
    }
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
