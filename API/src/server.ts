import cors from 'cors';
import fs from 'fs';
import express, {Express, NextFunction, Request, Response} from 'express';
import {ConfigType, ResponseType} from "~/types/types";
import {DataController} from '~~/src/ressources/data.controller'
import {AuthController} from '~~/src/ressources/auth.controller'
import {DataManagerController} from "~/ressources/dataManager.controller";
import {AuthModule} from "~/modules/auth.module";
import {DataModule} from "~/modules/data.module";
import {API_Error} from "~/types/errors";
import * as console from "node:console";
import cookieParser from "cookie-parser";


const CONFIG_FILE_PATH: string = "./config.json"


export class App {

  app: Express = express()
  config: ConfigType
  AuthController: AuthController
  DataController: DataController
  DataManagerController: DataManagerController


  AuthModule: AuthModule
  DataModule: DataModule


  constructor() {
    this.app.use(express.json())
    let tmp_config: ConfigType | undefined = this.getConfig()
    if (!tmp_config) {
      console.error("No config found, quitting the app")
      process.exit(2)
    }
    this.config = tmp_config
    this.AuthController = new AuthController(this)
    this.DataController = new DataController(this)
    this.DataManagerController = new DataManagerController(this)

    this.AuthModule = new AuthModule(this)
    this.DataModule = new DataModule(this)

    this.app.use(cors())
    this.app.use(cookieParser())

    this.app.use(this.logRequest)
    this.app.use(this.DataController.mainEndpoint, this.DataController.router)
    this.app.use(this.AuthController.mainEndpoint, this.AuthController.router)
    this.app.use(this.DataManagerController.mainEndpoint, this.DataManagerController.router)

    this.app.use((req, res, next) => {
      let endpoint = req.url
      this.sendResponse(res, {}, {code: 404, message: `Endpoint '${endpoint}' not found...`})
    })

    console.log(`Serving server on ${this.config.webserver.host}:${this.config.webserver.port}`)
    this.app.listen(this.config.webserver.port, this.config.webserver.host)
  }

  logRequest(req: Request, res: Response, next: NextFunction) {
    let ip = req.ip
    let endpoint = req.url
    let date = new Date().toUTCString()
    console.log(`${date} | ${ip} | ${endpoint}`)
    next()
  }

  sendResponse(res: Response, data: any, params?: {code?: number, message?: string, token?: string}) {
    let responseObject: ResponseType = {
      date: new Date().getTime(),
      data: data,
      status: {
        code: params?.code ? params.code : 200,
        message: params?.message ? params.message : undefined
      },
    }
    if (params?.token) {
      responseObject.token = params.token
      res.cookie(this.config.auth.cookieName, params.token)
    }
    res.status(responseObject.status.code)
    res.json(responseObject)
  }

  handleError(res: Response, error: unknown) {
    if (error instanceof API_Error) {
      this.sendResponse(res, error.cause, {code: error.code, message: error.message})
    } else {
      throw error
    }
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
