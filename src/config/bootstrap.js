/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'
import { Controller } from '../controllers/Controller.js'
import { GitLabService } from '../services/GitLabService.js'

const iocContainer = new IoCContainer()

iocContainer.register('GitLabServiceSingleton', GitLabService, {
  singleton: true
})

iocContainer.register('Controller', Controller, {
  dependencies: [
    'GitLabServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
