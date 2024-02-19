import {Router} from "express";
import {App} from "~/server";
import {AuthResponseType} from "~/types/types";

export class DataManagerController {

  App: App
  router: Router
  mainEndpoint: string = "/manage"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    this.router.get('/', (req, res) => {
      let auth: AuthResponseType = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        this.App.sendResponse(res, undefined, {code: 200, message: "OK"})
      }
    })

    this.router.get('/purify', (req, res) => {
      let auth: AuthResponseType = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        this.App.DataModule.purifyTables()
        this.App.sendResponse(res, undefined, {code: 200, message: "Data purifying method executed"})
      }
    })

    this.router.get('/refreshData', (req, res) => {
      let auth: AuthResponseType = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        this.App.DataModule.updateAllTable()
          .then(r => this.App.sendResponse(res, undefined, {code: 200, message: "All tables has been refreshed"}))
          .catch(r => this.App.sendResponse(res, undefined, {code: 500, message: "Une erreur est survenue dans le programme"}))
      }
    })

    this.router.post('/modifyData/:table', (req, res) => {
      let auth = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {}
    })

  }
}
