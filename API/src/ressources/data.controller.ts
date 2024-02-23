import {Router} from "express";
import {App} from "~/server";
import {TableObjectType} from "~/types/types";

export class DataController {

  App: App
  router: Router
  mainEndpoint: string = "/data"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    this.router.get('/', (req, res) => {
      this.App.DataModule.checkIfDataIsUpToDate()
      this.App.sendResponse(res, undefined, {code: 200})
    })

    this.router.get('/rawTable/:table', (req, res) => {
      this.App.DataModule.checkIfDataIsUpToDate()
      let tableResult = this.App.DataModule.rawTablesData.get(req.params.table)
      if (!tableResult) {
        this.App.sendResponse(res, undefined, {code: 404, message: "Table not found"})
      } else {
        let responseObject =  {
          tableName: req.params.table,
          tableLastRefresh: this.App.DataModule.lastRefresh.getTime(),
          tableData: tableResult
        }
        this.App.sendResponse(res, responseObject, {code: 200})
      }
    })

    this.router.get('/table/:table', (req, res) => {
      this.App.DataModule.checkIfDataIsUpToDate()
      let tableResult = this.App.DataModule.purifiedTablesData.get(req.params.table)
      if (!tableResult) {
        this.App.sendResponse(res, undefined, {code: 404, message: "Table not found"})
      } else {
        let responseObject: TableObjectType =  {
          tableName: req.params.table,
          tableLastRefresh: this.App.DataModule.lastRefresh.getTime(),
          tableData: tableResult
        }
        this.App.sendResponse(res, responseObject, {code: 200})
      }
    })

    this.router.get('/allRawTables', (req, res) => {
      this.App.DataModule.checkIfDataIsUpToDate()
      let responseObject = Array.from(this.App.DataModule.rawTablesData.keys())
      this.App.sendResponse(res, responseObject, {code: 200})
    })

    this.router.get('/allTables', (req, res) => {
      let responseObject = this.App.DataModule.alltablePurified
      this.App.sendResponse(res, responseObject, {code: 200})
    })

  }
}
