import createError from 'http-errors'

/**
 * Represents an authorization helper.
 */
export class AuthHelper {
  /**
   * Checks if the user is authenticated.
   *
   * @param {object} req - Express request object.
   * @param {object} res - Express response object.
   * @param {Function} next - Express next middleware function.
   */
  authorizeRequest (req, res, next) {
    req.session.accessToken ? next() : next(createError(401))
  }
}
