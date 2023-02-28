import { Service } from '../services/Service.js'

export class Controller {
  #service

  constructor (service = new Service()) {
    this.#service = service
  }

  index (req, res) {
    res.render('index')
  }
}
