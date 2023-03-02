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

    next(createError(400))
  }
}
