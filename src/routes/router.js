import express from 'express'
import createError from 'http-errors'

export const router = express.Router()

/**
 * Resolves a Controller object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a Controller object.
 */
const resolveController = (req) => req.app.get('container').resolve('Controller')

/**
 * Checks if the user is authenticated.
 *
 * @param {object} req - Express request object.
 * @param {object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
function authorizeRequest (req, res, next) {
  req.session.accessToken ? next() : next(createError(401))
}

// Implement router
router.get('/', (req, res, next) => resolveController(req).index(req, res, next))
router.get('/login', (req, res, next) => resolveController(req).login(req, res, next))
router.get('/profile', authorizeRequest, (req, res, next) => resolveController(req).profile(req, res, next))
router.get('/activities', authorizeRequest, (req, res, next) => resolveController(req).activities(req, res, next))
router.get('/groups', authorizeRequest, (req, res, next) => resolveController(req).groups(req, res, next))
router.get('/logout', authorizeRequest, (req, res, next) => resolveController(req).logout(req, res, next))

router.get('/oauth/callback', (req, res, next) => resolveController(req).oauthCallback(req, res, next))

router.use('*', (req, res, next) => next(createError(404)))
