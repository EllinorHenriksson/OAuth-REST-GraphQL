import { GitLabService } from '../services/GitLabService.js'
import { ServiceBase } from '../services/ServiceBase.js'
import randomstring from 'randomstring'
import fetch from 'node-fetch'
import createError from 'http-errors'
import jwt from 'jsonwebtoken'

export class Controller {
  /**
   * @type {ServiceBase}
   */
  #service

  constructor (service = new GitLabService()) {
    this.#service = service
  }

  index (req, res, next) {
    res.render('index')
  }

  login (req, res, next) {
    const state = randomstring.generate()
    req.session.state = state
    res.redirect(307, `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.APP_ID}&redirect_uri=${process.env.CALLBACK}&response_type=code&state=${state}&scope=read_api+openid+profile+email`)
  }

  profile (req, res, next) {
    // Fetch profile info
    res.render('profile')
  }

  activities (req, res, next) {
    // Fetch activities
    res.render('activities')
  }

  groups (req, res, next) {
    // Fetch groups and projects
    res.render('groups')
  }

  logout (req, res, next) {
    // Log out with OAuth
    // Destroy session
  }

  // Redirect url for oauth
  async oauthCallback (req, res, next) {
    if (req.query.state === req.session.state) {
      const code = req.query.code
      console.log('Code: ', code)
      // Request access token
      try {
        const response = await fetch(`https://gitlab.lnu.se/oauth/token?client_id=${process.env.APP_ID}&client_secret=${process.env.APP_SECRET}&code=${code}&grant_type=authorization_code&redirect_uri=${process.env.CALLBACK}`, { method: 'POST' })

        if (!response.ok) {
          console.log(response)
          throw createError(response.status, response.statusText)
        }

        const data = await response.json()

        // Regenerate session
        req.session.regenerate(error => {
          if (error) {
            throw new Error('Failed to regenerate session.')
          }
        })

        // Store access token and user info in session store
        req.session.accessToken = data.access_token
        const payload = jwt.decode(data.id_token, { json: true })
        req.session.user = {
          id: payload.sub,
          email: payload.email,
          groups: payload.groups_direct
        }

        res.redirect('/')
      } catch (error) {
        next(error)
      }
    } else {
      next(createError(400))
    }
  }
}
