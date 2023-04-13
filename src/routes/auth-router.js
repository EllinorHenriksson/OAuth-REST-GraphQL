import express from 'express'

export const router = express.Router()

/**
 * Resolves an AuthController object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as a AuthController object.
 */
const resolveController = (req) => req.app.get('container').resolve('AuthController')

/**
 * Resolves an AuthHelper object from the IoC container.
 *
 * @param {object} req - Express request object.
 * @returns {object} An object that can act as an AuthHelper object.
 */
const resolveHelper = (req) => req.app.get('container').resolve('AuthHelperSingleton')

router.get('/login', (req, res, next) => resolveController(req).login(req, res, next))

router.get('/logout', (req, res, next) => resolveHelper(req).authorizeRequest(req, res, next), (req, res, next) => resolveController(req).logout(req, res, next))

router.get('/callback', (req, res, next) => resolveController(req).callback(req, res, next))
