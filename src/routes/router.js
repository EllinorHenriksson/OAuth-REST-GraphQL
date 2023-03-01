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

// Implement router
router.get('/', (req, res, next) => resolveController(req).index(req, res, next))
router.get('/login', (req, res, next) => resolveController(req).login(req, res, next))
router.get('/profile', (req, res, next) => resolveController(req).profile(req, res, next))
router.get('/activities', (req, res, next) => resolveController(req).activities(req, res, next))
router.get('/groups', (req, res, next) => resolveController(req).groups(req, res, next))
router.get('/logout', (req, res, next) => resolveController(req).logout(req, res, next))

router.use('*', (req, res, next) => next(createError(404)))
