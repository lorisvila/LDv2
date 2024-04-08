import {App} from "~/server";
import {Request, Response} from "express";
import {AuthResponseType, RequestType, UserType} from "~/types/types";
import {VerifyErrors} from "jsonwebtoken";
const jwt = require("jsonwebtoken");


export class AuthModule {

  MAIN_TOKEN: string
  App: App

  constructor(mainClass: App) {
    this.App = mainClass
    this.MAIN_TOKEN = mainClass.config.auth.mainToken
  }

  createUserToken(username: string): string {
    let userToken = jwt.sign({username: username}, this.MAIN_TOKEN, {expiresIn: "5d"})
    return userToken
  }

  checkUserPassword(req: Request, res: Response): AuthResponseType {
    let reqObject: RequestType = req.body as RequestType
    let authResponseObject: AuthResponseType = new AuthResponseType()
    if (!reqObject || !reqObject.data.username || !reqObject.data.password) {
      authResponseObject.code = 400
      authResponseObject.message = "Il manque des éléments dans ta requête..."
      this.App.sendResponse(res, undefined, authResponseObject)
      return authResponseObject
    }
    let userFind: UserType | undefined = this.App.config.adminUsers.find((user: UserType) => user.username == reqObject.data.username && user.password == reqObject.data.password)
    if (!userFind) {
      authResponseObject.code = 401
      authResponseObject.message = "Les identifiants fournis sont incorrects..."
      this.App.sendResponse(res, undefined, authResponseObject)
      return authResponseObject
    }
    authResponseObject.username = reqObject.data.username
    return authResponseObject
  }

  checkUserToken(req: Request, res: Response): AuthResponseType { // true if authentificated and false if not
    let reqObject: RequestType = req.body
    let authResponseObject: AuthResponseType = new AuthResponseType()

    if (!reqObject) {
      authResponseObject.code = 401
      authResponseObject.message = "Il manque du contenu dans la requête"
      this.App.sendResponse(res, undefined, authResponseObject)
      return authResponseObject
    }
    try {
      let token = reqObject.data.token
    } catch(err) {
      authResponseObject.code = 401
      authResponseObject.message = "Il manque le token dans votre requête..."
      this.App.sendResponse(res, undefined, authResponseObject)
      return authResponseObject
    }

    let username: undefined | string = undefined
    try {
      let token = ""
      if (reqObject.data.token) {token = reqObject.data.token}
      if (reqObject.token) {token = reqObject.token}
      username = jwt.verify(token, this.App.config.auth.mainToken).username
    } catch (err) {
      let errObject: VerifyErrors = (err as VerifyErrors)
      if (errObject?.name == "TokenExpiredError") {
        authResponseObject.code = 401
        authResponseObject.message = "Ton token a expiré"
      } else {
        authResponseObject.code = 401
        authResponseObject.message = "Ton token est invalide"
      }
    }

    if (authResponseObject.code != 200 || !username) {
      this.App.sendResponse(res, undefined, authResponseObject)
      return authResponseObject
    } else {
      // Ajouter le temps de dernière connexion
      this.App.config.adminUsers.some((user: UserType) => {
        if (user.username == username as any) {
          user.lastConnect = new Date().getTime()
          return
        }
      })
      this.App.writeConfig()
      authResponseObject.username = username
      return authResponseObject
    }
  }

}
