import {Request, Response, Router} from "express";
import {App} from "~/server";
import {RequestType, UserType} from "~/types/types";
import {API_Error} from "~/types/errors";

export class DataManagerController {

  App: App
  router: Router
  mainEndpoint: string = "/manageData"

  constructor(mainClass: App) {
    this.router = Router()
    this.App = mainClass

    this.mainEndpoint = "/dataManage"

    // ####################################
    // Documents Endpoints

    this.router.post('/createDocument', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.document) {
          throw new API_Error('REQUEST_VALUES_MISSING', 'Le document est manquant dans votre requête...', {code: 422})
        }
        let document = reqObject.data.document as any

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
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.oldDocument || !reqObject.data.newDocument) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque l ${reqObject.data.newDocument ? "'ancien" : "e nouveau"} document dans votre requête...`, {code: 422})
        }
        let newDocument = reqObject.data.newDocument as any
        let oldDocument = reqObject.data.oldDocument as any

        this.App.DataModule.editEntry(oldDocument,newDocument, "documents").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/deleteDocument', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.document) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque le document dans votre requête...`, {code: 422})
        }
        let document = reqObject.data.document as any

        this.App.DataModule.deleteEntry(document, "documents").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    // ####################################
    // Filters Endpoints

    this.router.post('/createFilter', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.filter) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque le filtre dans votre requête...`, {code: 422})
        }
        let filter = reqObject.data.filter as any

        this.App.DataModule.createEntry(filter, "filters").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/editFilter', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.oldFilter || !reqObject.data.newFilter) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque le filtre dans votre requête...`, {code: 422})
        }
        let oldFilter = reqObject.data.oldFilter as any
        let newFilter = reqObject.data.newFilter as any

        this.App.DataModule.editEntry(oldFilter, newFilter, "filters").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/deleteFilter', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.filter) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque le filtre dans votre requête...`, {code: 422})
        }
        let filter = reqObject.data.filter as any

        this.App.DataModule.deleteEntry(filter, "filters").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    // ####################################
    // Engins & technicentres Endpoints

    this.router.post('/createEnginTechnicentre', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.engin) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque l'engin dans votre requête...`, {code: 422})
        }
        let engin = reqObject.data.engin as any

        //if ({'data2': {'test': ''}}.data && {'data2': {'test': ''}}.data.hasOwnProperty('test2')) {console.log(true)} else {console.log(false)}
        // TODO : Create a function global for all endpoints to checks if objects are included in the bodies of user requests

        this.App.DataModule.createEntry(engin, "engins_technicentre").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/deleteEnginTechnicentre', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('systemier', user)

        if (!reqObject.data.engin) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque l'engin dans votre requête...`, {code: 422})
        }
        let engin = reqObject.data.engin as any

        //if ({'data2': {'test': ''}}.data && {'data2': {'test': ''}}.data.hasOwnProperty('test2')) {console.log(true)} else {console.log(false)}
        // TODO : Create a function global for all endpoints to checks if objects are included in the bodies of user requests

        this.App.DataModule.deleteEntry(engin, "engins_technicentre").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/createTechnicentre', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('admin', user)

        if (!reqObject.data.technicentre) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque le technicentre dans votre requête...`, {code: 422})
        }
        let technicentre = reqObject.data.technicentre as any

        this.App.DataModule.createEntry(technicentre, "technicentres").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

    this.router.post('/deleteTechnicentre', (req: Request, res: Response) => {
      try {
        let reqObject: RequestType = req.body as RequestType
        let user: UserType = this.App.AuthModule.checkUserTokenFromPOST(req, res)
        this.App.AuthModule.checkRole('admin', user)

        if (!reqObject.data.technicentre) {
          throw new API_Error('REQUEST_VALUES_MISSING', `Il manque le technicentre dans votre requête...`, {code: 422})
        }
        let technicentre = reqObject.data.technicentre as any

        this.App.DataModule.deleteEntry(technicentre, "technicentres").then(() => {
          this.App.sendResponse(res, undefined)
        }).catch((error) => {
          this.App.handleError(res, error)
        })
      } catch (error) {
        this.App.handleError(res, error)
      }
    })

  }
}
