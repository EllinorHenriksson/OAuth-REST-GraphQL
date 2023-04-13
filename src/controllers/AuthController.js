import { AuthService } from '../services/AuthService.js'
import randomstring from 'randomstring'
import createError from 'http-errors'

/**
 * Represents an authorization controller.
 */
export class AuthController {
  /**
   * @type {AuthService}
   */
  #service

  /**
   * Initializing constructor.
   *
   * @param {AuthService} service - An AuthService object.
   */
  constructor (service = new AuthService()) {
    this.#service = service
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

    res.redirect('..')
  }

  /**
   * Redirect URL for GitLab's OAuth; requests access token and regenerates session.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async callback (req, res, next) {
    if (req.query.state === req.session.state) {
      try {
        const accessToken = await this.#service.requestAccessToken(req.query.code)

        req.session.regenerate(error => {
          if (error) {
            next(error)
          }
        })

        req.session.accessToken = accessToken

        res.redirect('../profile')
      } catch (error) {
        next(error)
      }
    }

    next(createError(401))
  }
}
