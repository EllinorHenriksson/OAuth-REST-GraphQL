import { GitLabService } from '../services/GitLabService.js'
import { ServiceBase } from '../services/ServiceBase.js'
import randomstring from 'randomstring'
import createError from 'http-errors'

/**
 * Represents a controller.
 */
export class Controller {
  /**
   * @type {ServiceBase}
   */
  #service

  /**
   * Initializing constructor.
   *
   * @param {ServiceBase} service - A concrete subclass to ServiceBase.
   */
  constructor (service = new GitLabService()) {
    this.#service = service
  }

  /**
   * Renders the start page.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  index (req, res) {
    res.render('index')
  }

  /**
   * Logs in the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   */
  login (req, res) {
    const state = randomstring.generate()
    req.session.state = state
    res.redirect(307, `https://gitlab.lnu.se/oauth/authorize?client_id=${process.env.APP_ID}&redirect_uri=${process.env.CALLBACK}&response_type=code&state=${state}&scope=read_api+read_user+openid+profile+email`)
  }

  async profile (req, res, next) {
    try {
      const user = await this.#service.getUserInfo(req.session.accessToken)
      res.render('profile', { viewData: user })
    } catch (error) {
      next(error)
    }
  }

  async activities (req, res, next) {
    try {
      const activities = await this.#service.getActivities(req.session.accessToken)
      res.render('activities', { viewData: activities })
    } catch (error) {
      next(error)
    }
  }

  groups (req, res, next) {
    // Fetch groups and projects
    res.render('groups')
  }

  /**
   * Logs out the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    try {
      await this.#service.revokeAccessToken(req.session.accessToken)
    } catch (error) {
      next(error)
    }

    req.session.destroy(error => {
      if (error) {
        next(error)
      }
    })

    res.redirect('/')
  }

  /**
   * Redirect URL for GitLab's OAuth; requests access token and regenerates session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async oauthCallback (req, res, next) {
    if (req.query.state === req.session.state) {
      try {
        const accessToken = await this.#service.requestAccessToken(req.query.code)

        req.session.regenerate(error => {
          if (error) {
            next(error)
          }
        })

        req.session.accessToken = accessToken

        res.redirect('/profile')
      } catch (error) {
        next(error)
      }
    }

    next(createError(401))
  }
}
