import { ServiceBase } from './ServiceBase.js'
import fetch from 'node-fetch'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

export class GitLabService extends ServiceBase {
  /**
   * Requests an access token from GitLab and returns the token and some user info.
   *
   * @param {string} code - The request code.
   * @returns {object} - An object with properties accessToken (string) and user (object { id (string), email (string), groups (string[])})
   */
  async requestAccessToken (code) {
    const response = await fetch(`https://gitlab.lnu.se/oauth/token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.CALLBACK}`, { method: 'POST' })

    if (!response.ok) {
      throw createError(response.status, response.statusText)
    }

    const { access_token: accessToken, id_token: idToken } = await response.json()
    const payload = jwt.decode(idToken, { json: true })

    return {
      accessToken,
      user: {
        id: payload.sub,
        email: payload.email,
        groups: payload.groups_direct
      }
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
      throw createError(500, `Fetch error: ${response.status} ${response.statusText}`)
    }
  }
}
