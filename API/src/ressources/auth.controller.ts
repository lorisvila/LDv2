import {Router} from "express";
import {App} from "~/server";
import {AuthUsername, RequestType, UserType} from "~/types/types";
import * as console from "node:console";
import {API_Error} from "~/types/errors";

export class AuthController {

  App: App
  router: Router
  mainEndpoint: string = "/auth"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    // Connect route
    this.router.post('/connect', (req, res) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserPassword(req, res)

        let userToken = this.App.AuthModule.createUserToken(user.username)
        this.App.AuthModule.addUserConnectDate(user.username)
        this.App.sendResponse(res, {token: userToken, user: user}, {token: userToken})
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/checkToken', (req, res) => {
      let reqObject: RequestType = req.body as RequestType
      try {
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)

        this.App.AuthModule.addUserConnectDate(user.username)
        this.App.sendResponse(res, {user: user}, {token: reqObject.token})
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.get('/users', (req, res) => {
      try {
        let user: UserType = this.App.AuthModule.checkUserTokenFromGET(req, res)
        this.App.AuthModule.checkRole('admin', user)

        this.App.sendResponse(res, {users: this.App.config.users})
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/createUser', (req, res) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromGET(req, res)
        this.App.AuthModule.checkRole('admin', user)

        if (!reqObject.data.user) {
          throw new API_Error('REQUEST_VALUES_MISSING', 'Des valeurs dans votre requêtes sont manquantes...', {code: 401})
        }
        let userToCreateObject = reqObject.data.user as UserType

        this.App.AuthModule.createUser(userToCreateObject.username, userToCreateObject.password, userToCreateObject.role)
        this.App.sendResponse(res, undefined)
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/deleteUser', (req, res) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromGET(req, res)
        this.App.AuthModule.checkRole('admin', user)

        if (!reqObject.data.user) {
          throw new API_Error('REQUEST_VALUES_MISSING', 'Des valeurs dans votre requêtes sont manquantes...', {code: 401})
        }
        let userToDeleteObject = reqObject.data.user as UserType

        this.App.AuthModule.deleteUser(userToDeleteObject.username)
        this.App.sendResponse(res, undefined)
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/editUser', (req, res) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromGET(req, res)
        this.App.AuthModule.checkRole('admin', user)

        if (!reqObject.data.oldUser || !reqObject.data.newUser) {
          throw new API_Error('REQUEST_VALUES_MISSING', 'Des valeurs dans votre requête sont manquantes...', {code: 401})
        }

        let oldUserToEditObject = reqObject.data.oldUser as UserType
        let newUserToEditObject = reqObject.data.newUser as UserType

        this.App.AuthModule.deleteUser(oldUserToEditObject.username)
        this.App.AuthModule.createUser(newUserToEditObject.username, newUserToEditObject.password, newUserToEditObject.role)
        this.App.sendResponse(res, undefined)
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

  }

}
