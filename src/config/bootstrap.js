/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'
import { AuthService } from '../services/AuthService.js'
import { ResourceService } from '../services/ResourceService.js'
import { AuthController } from '../controllers/AuthController.js'
import { ResourceController } from '../controllers/ResourceController.js'
import { AuthHelper } from '../util/AuthHelper.js'

const iocContainer = new IoCContainer()

iocContainer.register('AuthServiceSingleton', AuthService, {
  singleton: true
})

iocContainer.register('ResourceServiceSingleton', ResourceService, {
  singleton: true
})

iocContainer.register('AuthController', AuthController, {
  dependencies: [
    'AuthServiceSingleton'
  ]
})

iocContainer.register('ResourceController', ResourceController, {
  dependencies: [
    'ResourceServiceSingleton'
  ]
})

iocContainer.register('AuthHelperSingleton', AuthHelper, {
  singleton: true
})

export const container = Object.freeze(iocContainer)
