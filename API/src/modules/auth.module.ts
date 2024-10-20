import {App} from "~/server";
import {Request, Response} from "express";
import {AuthUsername, RequestType, RoleType, UserType} from "~/types/types";
import {VerifyErrors} from "jsonwebtoken";
import {API_Error} from "~/types/errors";
import * as jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import {Logger} from "pino";

export class AuthModule {

  MAIN_TOKEN: string
  App: App
  Users: Map<string, UserType> = new Map()

  logger: Logger

  constructor(mainClass: App) {
    this.App = mainClass
    this.MAIN_TOKEN = this.App.config.auth.mainToken
    this.logger = this.App.AppLogger.createChildLogger(this.constructor.name)

    // Create a HashMap of users
    this.App.config.users.forEach((user) => {
      this.Users.set(user.username, user)
    })
  }

  createUserToken(username: string): string {
    let expireDate: string = "5d"
    let userToken = jwt.sign({username: username}, this.MAIN_TOKEN, {expiresIn: expireDate})
    this.logger.debug(`Creating a token for ${username}, expires in ${expireDate}`)
    return userToken
  }

  checkUserPassword(req: Request, res: Response): UserType {
    let reqObject: RequestType = req.body as RequestType
    if (!reqObject || !reqObject.data.username || !reqObject.data.password) {
      throw new API_Error('BAD_REQUEST', 'Il manque des éléments dans ta requête...', {code: 422})
    }
    let username = reqObject.data.username
    let password = reqObject.data.password
    let userFind: UserType | undefined = this.Users.get(username)
    if (!userFind) {
      this.logger.warn(`Attempt to log in with unknown username ${username}`)
      throw new API_Error('BAD_CREDENTIALS', "L'utilisateur n'a pas été trouvé...", {code: 404})
    }
    let match = bcrypt.compareSync(password, userFind.password)
    if (!match) {
      this.logger.warn(`Attempt to log in with username ${username} with wrong password`)
      throw new API_Error('BAD_CREDENTIALS', "Mauvais mot de passe !", {code: 401})
    }
    return userFind
  }

  checkUserTokenFromPOST(req: Request, res: Response): UserType { // true if authentificated and false if not
    let reqObject: RequestType = req.body
    if (!reqObject) {
      throw new API_Error('BAD_REQUEST', 'Il manque du contenu dans la requête', {code: 401})
    }
    try {
      let token = reqObject.data.token // TODO : Améliorer ce check de variable --> faire un if === undefined à la place
    } catch(err) {
      throw new API_Error('REQUEST_VALUES_MISSING', 'Il manque le token dans votre requête...', {code: 401})
    }

    try {
      let token = ""
      if (reqObject.data.token) {token = reqObject.data.token}
      if (reqObject.token) {token = reqObject.token}
      let username = (jwt.verify(token, this.MAIN_TOKEN) as any).username

      // Si pas d'erreur au dessus, jwt valide
      let user = this.Users.get(username)
      if (!user) {
        this.logger.warn('User tried to log in with a token related with a unknown user...')
        throw new API_Error('BAD_CREDENTIALS', 'Utilisateur non trouvé dans la base de donnée')
      }
      return user

    } catch (err) {
      let errObject: VerifyErrors = (err as VerifyErrors)
      if (errObject?.name == "TokenExpiredError") {
        this.logger.debug('User tried to log in with an expired token')
        throw new API_Error('EXPIRED_TOKEN', "Ton token a expiré", {code: 401})
      } else {
        this.logger.debug('User tried to log in with an invalid token')
        throw new API_Error('INVALID_TOKEN', "Ton token est invalide", {code: 401})
      }
    }

  }

  checkUserTokenFromGET(req: Request, res: Response): UserType {
    let reqHeaders = req.headers

    if (reqHeaders.token == undefined) {
      throw new API_Error('REQUEST_VALUES_MISSING', 'Il manque le token dans votre requête...', {code: 401})
    }

    try {
      let token: string = (reqHeaders.token as string)
      let username = (jwt.verify(token, this.MAIN_TOKEN) as any).username

      // Si pas d'erreur au dessus, jwt valide
      let user = this.Users.get(username)
      if (!user) {
        this.logger.warn('User tried to log in with a token related with a unknown user...')
        throw new API_Error('BAD_CREDENTIALS', 'Utilisateur non trouvé dans la base de donnée')
      }
      return user

    } catch (err) {
      let errObject: VerifyErrors = (err as VerifyErrors)
      if (errObject?.name == "TokenExpiredError") {
        this.logger.debug('User tried to log in with an expired token')
        throw new API_Error('EXPIRED_TOKEN', "Ton token a expiré", {code: 401})
      } else {
        this.logger.debug('User tried to log in with an invalid token')
        throw new API_Error('INVALID_TOKEN', "Ton token est invalide", {code: 401})
      }
    }
  }

  createUser(username: string, password: string, role: RoleType): void {
    if (this.Users.has(username)) {
      throw new API_Error('USER_ALREADY_EXISTS', "L'utilistateur souhaité existe déjà...", {code: 409})
    }
    if (password == '' || username == '') {
      throw new API_Error('BAD_CREDENTIALS', "L'utilistateur ou mot de passe ne peuvent pas être vides...", {code: 401})
    }
    let hashedPassword = this.createHashUserPassword(password)
    let userObject: UserType = {
      username: username,
      password: hashedPassword,
      role: role
    }
    this.writeUser(username, userObject)
    this.logger.info(`User ${username} created successfully !`)
  }

  checkRole(wantedRole: RoleType, user: UserType): void {
    let wantedRoleWeight = this.App.config.roles[wantedRole]
    let userRoleWeight = this.App.config.roles[user.role]
    if (userRoleWeight < wantedRoleWeight) {
      this.logger.warn("User wanted to do a unauthorized request due to it's permissions level")
      throw new API_Error('USER_ROLE_INSUFFICIENT', "Vous n'avez pas le droit d'accéder à cette ressource", {code: 403})
    }
  }

  createHashUserPassword(password: string): string {
    return bcrypt.hashSync(password, 10)
  }

  writeUser(username: string, userObject: UserType): void {
    if (!this.Users.has(username)) {
      this.App.config.users.push(userObject)
      this.App.writeConfig()
    } else {
      let foundUserObject = this.App.config.users.find((user) => user.username === username)
      if (!foundUserObject) {
        throw new API_Error('BAD_CREDENTIALS', 'Strange to have a user not found in the user DB here...', {code: 500})
      }
      let userIndex = this.App.config.users.indexOf(foundUserObject)
      this.App.config.users.splice(userIndex, 1)
      this.App.config.users.push(userObject)
      this.App.writeConfig()
    }
    this.Users.set(username, userObject)
  }

  deleteUser(username: string) {
    if (!this.Users.has(username)) {
      throw new API_Error('BAD_CREDENTIALS', "L'utilisateur n'a pas été trouvé...", {code: 404})
    }
    this.Users.delete(username)
    let foundUserObject = this.App.config.users.find((user) => user.username === username)
    if (!foundUserObject) {
      throw new API_Error('BAD_CREDENTIALS', "L'utilisateur demandé n'a pas été trouvé...", {code: 404})
    }
    let userIndex = this.App.config.users.indexOf(foundUserObject)
    this.App.config.users.splice(userIndex, 1)
    this.App.writeConfig()
  }

  addUserConnectDate(username: string): void {
    let userObject = this.Users.get(username)
    if (!userObject) {
      throw new API_Error('BAD_CREDENTIALS', "User not found...", {code: 404})
    }
    userObject.lastConnect = new Date().getTime()
    this.writeUser(username, userObject)
  }

}
