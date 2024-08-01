import {NextFunction, Request, Response, Router} from "express";
import {App} from "~/server";
import {NOT_TO_DATE, UP_TO_DATE} from "~/types/types";
import {API_Error} from "~/types/errors";
import * as console from "node:console";
export class DataController {

  App: App
  router: Router
  mainEndpoint: string = "/data"

  lastRefreshRequest: Date = new Date();

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    this.router.use((req: Request, res: Response, next: NextFunction) => {
      if (this.App.DataModule.dbConnected) {
        next()
      } else {
        this.App.sendResponse(res, undefined, {code: 500, message: "Le serveur n'est pas connecté à la BDD. Veuillez réessayer plus tard"})
      }
    })

    this.router.get('/getTable/:tableName', (req: Request, res: Response) => {
      let tableName = req.params.tableName
      if (this.App.DataModule.checkIfDataIsUpToDate() === UP_TO_DATE) {
        let data = this.App.DataModule.allTables.get(tableName)
        if (!data) {
          this.App.handleError(res, new API_Error('TABLE_NOT_FOUND', `La table ${tableName} n'a pas été trouvée`))
          return
        }
        this.App.sendResponse(res, data)
      } else if (this.App.DataModule.checkIfDataIsUpToDate() === NOT_TO_DATE) {
        this.App.DataModule.getTable(tableName).then((data) => {
          this.App.sendResponse(res, data)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      }
    })

    this.router.get('/getAllTables', (req: Request, res: Response) => {
      this.App.DataModule.getAllTables().then((data) => {
        this.App.sendResponse(res, data)
      }).catch((error) => {
        this.App.handleError(res, error)
      })
    })

    this.router.get('/refresh', (req: Request, res: Response) => {
      this.App.DataModule.cacheData().then(() => {
        this.App.DataModule.getAllTables().then((data) => {
          this.App.sendResponse(res, data)
        })
      }).catch((error) => {
        this.App.handleError(res, error)
      })
    })

  }
}
