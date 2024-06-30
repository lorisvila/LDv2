import {Router} from "express";
import {App} from "~/server";
import {AuthResponseType, RequestType} from "~/types/types";

export class DataManagerController {

  App: App
  router: Router
  mainEndpoint: string = "/manage"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    /*this.router.get('/', (req, res) => {
      let auth: AuthResponseType = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        this.App.sendResponse(res, undefined, {code: 200, message: "OK"})
      }
    })*/

    this.router.get('/purify', (req, res) => {
      let auth: AuthResponseType = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        this.App.DataModule.purifyTables()
        this.App.sendResponse(res, undefined, {code: 200, message: "Data purifying method executed"})
      }
    })

    this.router.post('/refreshData', (req, res) => {
      let auth: AuthResponseType = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        this.App.DataModule.updateAllTable()
          .then(r => this.App.sendResponse(res, undefined, {code: 200, message: "All tables has been refreshed"}))
          .catch(r => this.App.sendResponse(res, undefined, {code: 500, message: "Une erreur est survenue dans le programme"}))
      }
    })

    this.router.post('/addDoc', (req, res) => {
      let auth = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        let reqObject: RequestType = req.body as RequestType
        if (!reqObject.data.action) {
          this.App.sendResponse(res, undefined, {code: 400, message: "Il manque des élements dans ta requête..."})
          return
        }
        try {
          let response = this.App.DataModule.addDocToDB(reqObject.data.object)
          this.App.sendResponse(res, undefined, {code: 200, message: "Le document a bien été ajouté dans la base de données"})
        } catch (err) {
          this.App.sendResponse(res, undefined, {code: 500, message: "Une erreur est survenue lors de l'ajout du document dans la BDD"})
        }
      }
    })

    this.router.post('/modifyDoc', (req, res) => {
      let auth = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        let reqObject: RequestType = req.body as RequestType
        if (!reqObject.data.action) {
          this.App.sendResponse(res, undefined, {code: 400, message: "Il manque des élements dans ta requête..."})
          return
        }
        console.log(reqObject.data)
        let response = this.App.DataModule.modDocFromDB(reqObject.data.object.id, reqObject.data.object)
        try {
          this.App.sendResponse(res, undefined, {code: 200, message: "Le document a bien été modifié dans la BDD"})
        } catch (err) {
          this.App.sendResponse(res, undefined, {code: 500, message: "Une erreur est survenue lors de l'ajout du document dans la BDD"})
        }
      }
    })

    this.router.post('/modifyData/:table', (req, res) => {
      let auth = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {}
    })

  }
}
