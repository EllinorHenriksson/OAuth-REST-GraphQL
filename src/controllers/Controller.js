import { GitLabService } from '../services/GitLabService.js'
import { ServiceBase } from '../services/ServiceBase.js'

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

  logout () {
    // Log out with OAuth
    // Destroy session
  }
}
