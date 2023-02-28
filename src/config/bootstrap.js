/**
 * Module for bootstrapping.
 */

import { IoCContainer } from '../util/IoCContainer.js'
import { Service } from '../services/Service.js'
import { Controller } from '../controllers/Controller.js'

const iocContainer = new IoCContainer()

iocContainer.register('ServiceSingleton', Service, {
  singleton: true
})

iocContainer.register('Controller', Controller, {
  dependencies: [
    'ServiceSingleton'
  ]
})

export const container = Object.freeze(iocContainer)
