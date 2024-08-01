import {Request, Response, Router} from "express";
import {App} from "~/server";
import {RequestType, UserType} from "~/types/types";
import {API_Error} from "~/types/errors";
import {ItemDataType} from "../../../src/app/app.types";

export class DataManagerController {

  App: App
  router: Router
  mainEndpoint: string = "/manageData"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    this.mainEndpoint = "/dataManage"

    this.router.post('/createDocument', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.document) {
          throw new API_Error('REQUEST_VALUES_MISSING', 'Le document est manquant dans votre requête...', {code: 401})
        }
        let document = reqObject.data.document as ItemDataType

        this.App.DataModule.createEntry(document, "documents").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/editDocument', (req: Request, res: Response) => {
      try {
        let user: UserType = this.App.AuthModule.checkUserTokenFromGET(req, res)
        this.App.AuthModule.checkRole('admin', user)

        this.App.sendResponse(res, undefined)
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

  }
}
