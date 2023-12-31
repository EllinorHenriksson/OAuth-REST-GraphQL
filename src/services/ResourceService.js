import fetch from 'node-fetch'

/**
 * Represents a ResourceService.
 */
export class ResourceService {
  /**
   * Gets the user info.
   *
   * @throws {Error} Throws an exception if the request fails.
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
    const { activities, nextPage } = await this.#fetchActivities(`https://gitlab.lnu.se/api/v4/events?per_page=100&access_token=${accessToken}`)

    if (nextPage) {
      const { activities: allActivities } = await this.#fetchActivities(`https://gitlab.lnu.se/api/v4/events?page=2&per_page=1&access_token=${accessToken}`, activities)

      return this.#filterActivityData(allActivities)
    }

    return this.#filterActivityData(activities)
  }

  /**
   * Fetches activities from GitLab.
   *
   * @throws {Error} Throws an exception if the request fails.
   * @param {string} url - The URL to fetch from.
   * @param {object[]} activities - Previously fetched activities (optional).
   * @returns {object[]} All fetched activities.
   */
  async #fetchActivities (url, activities = []) {
    const response = await fetch(url)

    if (!response.ok) {
      throw new Error('Failed to fetch activities.')
    }

    const nextPage = response.headers.get('x-next-page')
    const data = await response.json()
    activities = [...activities, ...data]
    return { activities, nextPage }
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
        createdAt: new Date(activity.created_at).toLocaleString(),
        targetTitle: activity.target_title,
        targetType: activity.target_type
      })
    }
    return activities
  }

  /**
   * Fetches the users groups, projects and subgroups from GitLab's GraphQL API.
   *
   * @throws {Error} Throws an exception if the request fails.
   * @param {string} accessToken The user's access token.
   * @returns {object} The user's groups.
   */
  async getGroups (accessToken) {
    const query = `{
      currentUser {
        groups(first: 3) {
          nodes {
            name
            webUrl
            avatarUrl
            fullPath
            descendantGroups {
              nodes {
                name
                webUrl
                avatarUrl
                fullPath
              }
            }
            projects(first: 5) {
              nodes {
                name
                webUrl
                avatarUrl
                fullPath
                repository {
                  tree {
                    lastCommit {
                      authoredDate
                      author {
                        name
                        username
                        avatarUrl
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
              }
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    }`

    const response = await fetch('https://gitlab.lnu.se/api/graphql', {
      method: 'POST',
      body: JSON.stringify({ query }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })

    if (!response.ok) {
      throw new Error('Failed to fetch groups.')
    }

    const { data } = await response.json()
    return data.currentUser.groups
  }
}
