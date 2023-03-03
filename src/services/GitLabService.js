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

  /**
   * Gets the user info.
   *
   * @param {string} accessToken - The access token.
   * @returns {object} The user info (id, name, username, email, avatar, lastActivityOn)
   */
  async getUserInfo (accessToken) {
    const response = await fetch(`https://gitlab.lnu.se/api/v4/user?access_token=${accessToken}`)

    if (!response.ok) {
      throw new Error('Failed to fetch user info.')
    }

    const { id, name, username, email, avatar_url: avatar, last_activity_on: lastActivityOn } = await response.json()

    return { id, name, username, email, avatar, lastActivityOn }
  }

  /**
   * Gets the user's activities from GitLab.
   *
   * @param {string} accessToken - The access token.
   * @returns {object[]} The activities ({ actionName: string, createdAt: string, targetTitle: string, targetType: string }).
   */
  async getActivities (accessToken) {
    // OBS! Fortsätt här med paginering i requesten
    const response = await fetch(`https://gitlab.lnu.se/api/v4/events?access_token=${accessToken}`)

    if (!response.ok) {
      throw new Error('Failed to fetch activities.')
    }

    const data = await response.json()

    return this.#filterActivityData(data)
  }

  /**
   * Filters the activity data.
   *
   * @param {object[]} data The activities as returned from GitLab.
   * @returns {object[]} The filtered activities ({ actionName: string, createdAt: string, targetTitle: string, targetType: string }).
   */
  #filterActivityData (data) {
    const activities = []
    for (const activity of data) {
      activities.push({
        actionName: activity.action_name,
        createdAt: activity.created_at,
        targetTitle: activity.target_title,
        targetType: activity.target_type
      })
    }
    return activities
  }
}
