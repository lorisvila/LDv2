import {Router} from "express";
import {App} from "~/server";
import {AuthResponseType, RequestType} from "~/types/types";

export class AuthController {

  App: App
  router: Router
  mainEndpoint: string = "/auth"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    // Connect route
    this.router.post('/connect', (req, res) => {
      let reqObject: RequestType = req.body as RequestType
      let auth: AuthResponseType = this.App.AuthModule.checkUserPassword(req, res)
      if (auth.code == 200) {
        let userToken = this.App.AuthModule.createUserToken(reqObject.data.username)
        this.App.sendResponse(res, {token: userToken}, {code: 200}, userToken)
      }
    })

    this.router.post('/checkToken', (req, res) => {
      let reqObject: RequestType = req.body as RequestType
      let auth: AuthResponseType = this.App.AuthModule.checkUserToken(req, res)
      if (auth.code == 200) {
        this.App.sendResponse(res, {username: auth.username}, {code: 200}, reqObject.token)
      }
    })

  }

}
