import { GitLabService } from '../services/GitLabService.js'
import { ServiceBase } from '../services/ServiceBase.js'
import { randomstring } from 'randomstring'
import fetch from 'node-fetch'

export class Controller {
  /**
   * @type {ServiceBase}
   */
  #service

  constructor (service = new GitLabService()) {
    this.#service = service
  }

  index (req, res) {
    res.render('index')
  }

  login (req, res) {
    const state = randomstring.generate()
    req.session.state = state
    res.redirect(`https://gitlab.example.com/oauth/authorize?client_id=${process.env.APP_ID}&redirect_uri=${process.env.CALLBACK}&response_type=code&state=${state}&scope=read_api+openid`)
    // Log in with OAuth
    // Regenerate session
    // Add user to req.session.user
  }

  profile (req, res) {
    // Fetch profile info
    res.render('profile')
  }

  activities (req, res) {
    // Fetch activities
    res.render('activities')
  }

  groups (req, res) {
    // Fetch groups and projects
    res.render('groups')
  }

  logout (req, res) {
    // Log out with OAuth
    // Destroy session
  }

  async oauthCallback (req, res) {
    // Redirect url for oauth
    if (req.query.state === req.session.state) {
      // Proceed
      const code = req.query.code
      // Request access token
      // OBS! Fortsättt här
      const response = await fetch('')

      // Check if response OK

      const data = await response.json()
    } else {
      // Error
    }
  }
}
