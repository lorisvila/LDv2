import cors from 'cors';
import fs from 'fs';
import express, {Express, NextFunction, Request, Response} from 'express';
import {ConfigType, ResponseType} from "~/types/types";
import {DataController} from '~~/src/ressources/data.controller'
import {AuthController} from '~~/src/ressources/auth.controller'
import {DataManagerController} from "~/ressources/dataManager.controller";
import {AuthModule} from "~/modules/auth.module";
import {DataModule} from "~/modules/data.module";


const CONFIG_FILE_PATH: string = "./config.json"


export class App {

  app: Express = express()
  config: ConfigType
  AuthController: AuthController
  DataController: DataController
  DataManagerController: DataManagerController
  AuthModule: AuthModule
  DataModule: DataModule
  httpServerRunning: boolean = false


  constructor() {
    this.app.use(express.json())
    let tmp_config: ConfigType | undefined = this.getConfig()
    if (!tmp_config) {
      process.exit(2)
    }
    this.config = tmp_config
    this.AuthController = new AuthController(this)
    this.DataController = new DataController(this)
    this.DataManagerController = new DataManagerController(this)

    this.AuthModule = new AuthModule(this)
    this.DataModule = new DataModule(this)

    this.app.use(cors())

    this.app.use(this.logRequest)
    this.app.use(this.DataController.mainEndpoint, this.DataController.router)
    this.app.use(this.AuthController.mainEndpoint, this.AuthController.router)
    this.app.use(this.DataManagerController.mainEndpoint, this.DataManagerController.router)

    this.app.use((req, res, next) => {
      let endpoint = req.url
      this.sendResponse(res, {}, {code: 404, message: `Endpoint '${endpoint}' not found...`})
    })

    this.DataModule.$dataReady.on('finished', () => {
      if (!this.httpServerRunning) { // The event may be called multiple time so do not try to launch another instance when it is called again
        this.httpServerRunning = true
        console.log(`Serving server on ${this.config.webserver.host}:${this.config.webserver.port}`)
        this.app.listen(this.config.webserver.port, this.config.webserver.host)
      }
    })
  }

  logRequest(req: Request, res: Response, next: NextFunction) {
    let ip = req.ip
    let endpoint = req.url
    let date = new Date().toUTCString()
    console.log(`${date} | ${ip} | ${endpoint}`)
    next()
  }

  sendResponse(res: Response, data: any, status: {code: number, message?: string}, token?: string) {
    let responseObject: ResponseType = {
      date: new Date().getTime(),
      data: data,
      status: status,
    }
    if (token) {
      responseObject.token = token
      res.cookie(this.config.auth.cookieName, token)
    }
    res.status(responseObject.status.code )
    res.json(responseObject)
  }

  getConfig(): ConfigType | undefined {
    try {
      let config = fs.readFileSync(CONFIG_FILE_PATH, 'utf-8')
      let configJSON = JSON.parse(config)
      return configJSON as ConfigType
    } catch {
      return undefined
    }
  }

  writeConfig() {
    fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(this.config, null, 4))
  }

}

const server: App = new App()
