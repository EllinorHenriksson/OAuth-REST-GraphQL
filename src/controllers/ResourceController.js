import { ResourceService } from '../services/ResourceService.js'

/**
 * Represents a resource controller.
 */
export class ResourceController {
  /**
   * @type {ResourceService}
   */
  #service

  /**
   * Initializing constructor.
   *
   * @param {ResourceService} service - A ResourceService object.
   */
  constructor (service = new ResourceService()) {
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
   * Presents the profile.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async profile (req, res, next) {
    try {
      const user = await this.#service.getUserInfo(req.session.accessToken)
      res.render('profile', { viewData: { user } })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Presents the activities.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async activities (req, res, next) {
    try {
      const activities = await this.#service.getActivities(req.session.accessToken)
      res.render('activities', { viewData: { activities } })
    } catch (error) {
      next(error)
    }
  }

  /**
   * Presents the groups.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  async groups (req, res, next) {
    try {
      const groups = await this.#service.getGroups(req.session.accessToken)
      res.render('groups', { viewData: { groups } })
    } catch (error) {
      next(error)
    }
  }
}
