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

  /**
   * Logs out the user.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async logout (req, res, next) {
    if (req.session.accessToken) {
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

    next(createError(401))
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
        const { accessToken, user } = await this.#service.requestAccessToken(req.query.code)

        req.session.regenerate(error => {
          if (error) {
            throw new Error('Failed to regenerate session.')
          }
        })

        req.session.accessToken = accessToken
        req.session.user = user

        res.redirect('/')
      } catch (error) {
        next(error)
      }
    }

    next(createError(401))
  }
}
