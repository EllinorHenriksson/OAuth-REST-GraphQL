import express from 'express'

export const router = express.Router()

/**
 * Resolves a Controller object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a Controller object.
 */
const resolveController = (req) => req.app.get('container').resolve('ResourceController')

/**
 * Resolves an AuthHelper object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as an AuthHelper object.
 */
const resolveHelper = (req) => req.app.get('container').resolve('AuthHelperSingleton')

router.get('/', (req, res, next) => resolveController(req).index(req, res, next))

router.get('/profile', (req, res, next) => resolveHelper(req).authorizeRequest(req, res, next), (req, res, next) => resolveController(req).profile(req, res, next))

router.get('/activities', (req, res, next) => resolveHelper(req).authorizeRequest(req, res, next), (req, res, next) => resolveController(req).activities(req, res, next))

router.get('/groups', (req, res, next) => resolveHelper(req).authorizeRequest(req, res, next), (req, res, next) => resolveController(req).groups(req, res, next))
