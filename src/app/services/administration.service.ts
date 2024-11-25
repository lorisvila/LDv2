import {Injectable} from '@angular/core';
import {
  API_ResponseType,
  EditingCreatingType, EnginType,
  FilterType,
  ItemDataType,
  TechnicentreType,
  UserType
} from "../app.types";
import {DataService} from "./data.service";
import {CommunicationService} from "./communication.service";
import {GeneralService} from "./general.service";
import {ToastrService} from "ngx-toastr";
import {HttpErrorResponse} from "@angular/common/http";
import {EnginService} from "./engin.service";
import {Router} from "@angular/router";
import {FormlyFieldConfig, FormlyFormOptions} from "@ngx-formly/core";
import {UntypedFormGroup} from "@angular/forms";
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AdministrationService {


  constructor(
    public dataService: DataService,
    public communicationService: CommunicationService,
    public generalService: GeneralService,
    public notif: ToastrService,
    public enginService: EnginService,
    public router: Router
  ) {
    this.checkToken()

  }

  // ################################### GLOBAL ###################################
  auth_username: string | undefined  = ""
  auth_password: string | undefined = ""
  auth_message: string | undefined = ""
  auth_status: boolean = false
  auth_pending: boolean = false // True when the auth request is up
  auth_user: UserType | undefined = undefined

  // Function to check the token in localStorage
  checkToken() {
    let token = this.communicationService.getDataFromStorage('token')
    if (token) {
      let requestObject = {"token": token}
      let endpoint = this.communicationService.API_Endpoint_checkToken
      this.communicationService.requestToAPI("POST", endpoint, requestObject).subscribe((response) => {
        let responseObject = (response as API_ResponseType)
        if (responseObject.status.code == 200) {
          this.auth_status = true
          this.auth_username = responseObject.data.user.username
          this.auth_user = responseObject.data.user
          this.communicationService.API_token = token
          this.communicationService.$API_token.emit(token)
        } else {
          this.notif.warning(responseObject.status.message)
          this.communicationService.deleteDataFromStorage("token")
        }
      }, (error) => {
        this.communicationService.handleErrorResponse(error)
        this.communicationService.deleteDataFromStorage("token")
      })
    }
  }

  // Function to authentificate user from the API
  authentificateUser(user: string | number | null | undefined, password: string | number | null | undefined) {
    if (user && password && typeof user == "string" && typeof password == "string") {
      this.auth_username = user
      this.auth_password = password
      this.auth_pending = true
      let requestObject = {"username": user, "password": password}
      let endpoint = this.communicationService.API_Endpoint_authConnect
      this.communicationService.requestToAPI("POST", endpoint, requestObject).subscribe((response) => {
        let responseObject = (response as API_ResponseType)
        if (responseObject.status.code == 200) {
          this.communicationService.updateDataToStorage('token', responseObject.token)
          this.communicationService.API_token = responseObject.token
          this.generalService.toggleModal('authConnect', false)
          this.auth_status = true
          this.auth_message = undefined
          this.auth_pending = false
          this.auth_user = responseObject.data.user
        }
      }, (error) => {
        error = error as HttpErrorResponse
        let responseObject = (error.error as API_ResponseType)
        if (responseObject.status) {
          this.auth_message = responseObject.status.message
        } else {
          this.auth_message = "Une erreur est survenue lors de la requête..."
        }
        this.auth_pending = false
      })
    } else {
      this.notif.warning("Veuillez remplir le champ utilisateur et mot de passe...")
    }
  }

  disconnectUser() {
    this.auth_status = false
    this.auth_password = undefined
    this.auth_username = undefined
    this.communicationService.deleteDataFromStorage('token')
  }

  // ################################### Users ###################################

  users: UserType[] = []
  user_selectedUser: UserType | undefined = undefined

  userModalForm: UntypedFormGroup = new UntypedFormGroup({});
  userModalFormModel = {
    username: '',
    password: '',
    role: ''
  }
  userModalFormFields: FormlyFieldConfig[] = [
    {
      fieldGroupClassName: 'columnForm',
      fieldGroup: [
        {
          id: 'username',
          key: 'username',
          type: 'input',
          props: {
            label: 'Utilisateur',
            placeholder: '0400152Y',
            required: true,
          }
        },
        {
          id: 'password',
          key: 'password',
          type: 'input',
          props: {
            label: 'Mot de passe',
            placeholder: 'yDg-4he6!',
            required: false,
          }
        },
        {
          id: 'role',
          key: 'role',
          type: 'select',
          props: {
            label: 'Rôle',
            placeholder: 'Administrateur',
            required: true,
            options: [
              { value: 'admin', label: 'Administrateur' },
              { value: 'systemier', label: 'Sytemier' }
            ],
          },
        }
      ]
    }
  ]

  getUsers(): void {
    this.communicationService.requestToAPI("GET", this.communicationService.API_Endpoint_GetUsers).subscribe(
      (response) => {
        let responseObject = this.communicationService.handleResponse(response)
        if (responseObject) { // If request = code 200
          this.users = responseObject.data.users
        }
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  openModalCreateUser() {
    this.user_selectedUser = undefined
    this.userModalFormModel = {
      username: '',
      password: '',
      role: ''
    }
    this.generalService.toggleModal('userEdit', true)
  }

  createUser(): void {
    let userObject = this.userModalForm.value
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_CreateUser, {user: userObject}).subscribe(
      (response) => {
        let check = this.communicationService.handleResponse(response)
        if (check) { // If request = code 200
          this.notif.success('User created successfully')
          this.generalService.toggleModal('userEdit', false)
          this.getUsers()
        }
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  openModalEditUser(user: UserType) {
    this.user_selectedUser = user
    let objectForModel = JSON.parse(JSON.stringify(user))
    objectForModel.password = ''
    this.userModalFormModel = objectForModel
    this.generalService.toggleModal('userEdit', true)
  }

  editUser(): void {
    let oldUser = this.user_selectedUser
    let newUser = this.userModalForm.value
    if (newUser.password == '' && oldUser) { // Set the password to the oldOne if not modified / specified in the form
      newUser.password = oldUser.password
    }
    this.communicationService.requestToAPI('POST', this.communicationService.API_Endpoint_EditUser, {oldUser: oldUser, newUser: newUser}).subscribe(
      (response) => {
        let check = this.communicationService.handleResponse(response)
        if (check) { // If request = code 200
          this.notif.success('User edited successfully')
          this.generalService.toggleModal('userEdit', false) // Close modal and update data
          this.getUsers()
        }
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  deleteUser(user: UserType) {
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_DeleteUser, {user: user}).subscribe(
      (response) => {
        let check = this.communicationService.handleResponse(response)
        if (check) { // If request = code 200
          this.notif.success('User deleted successfully')
          this.generalService.toggleModal('userEdit', false)
          this.getUsers()
        }
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  // ################################### Document Edit & Create ###################################

  editingCreatingDocument: EditingCreatingType = 'CREATING';

  documentEditForm: UntypedFormGroup = new UntypedFormGroup({});
  emptyModel: ItemDataType = {
    id: 0,
    name: '',
    ref_main: '',
    page: '',
    engin: '',
    engin_type: [],
    meta: [],
    tags: [],
    links: []
  }
  documentEditFormModel: ItemDataType = JSON.parse(JSON.stringify(this.emptyModel))
  documentEditBackup: ItemDataType | undefined

  selectDocFromId(id: number | string) {
    if (typeof id == 'string') {
      id = parseInt(id)
    }
    let doc = this.dataService.allItemsData.find(document => document.id == id)
    if (!doc) {
      this.notif.error("Le document n'a pas été trouvé...")
    } else {
      this.editingCreatingDocument = "EDITING"
      this.documentEditFormModel = JSON.parse(JSON.stringify(doc))
      this.documentEditBackup = doc
      this.router.navigateByUrl('/administration#modif')
    }
  }

  resetFieldsEditDoc() {
    this.documentEditFormModel = JSON.parse(JSON.stringify(this.emptyModel))
    this.documentEditBackup = undefined
  }

  prepareUIcreateDoc() {
    this.resetFieldsEditDoc()
    this.editingCreatingDocument = 'CREATING'
  }

  sendModifiedDocument(forms: UntypedFormGroup[]) {
    forms.forEach(form => {
      form.disable()
    })
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_EditDocument, {oldDocument: this.documentEditBackup, newDocument: this.documentEditFormModel}).subscribe(
      (response) => {
        this.handleResponseDocument(response, forms, 'Le document a été modifié avec succès')
      },
      (error) => {
        this.handleDocumentErrorResponse(error, forms)
      }
    )
  }

  sendCreateDocument(forms: UntypedFormGroup[]) {
    forms.forEach(form => {
      form.disable()
    })
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_CreateDocument, {document: this.documentEditFormModel}).subscribe(
      (response) => {
        this.handleResponseDocument(response, forms, 'Le document a été crée avec succès')
      },
      (error) => {
        this.handleDocumentErrorResponse(error, forms)
      }
    )
  }

  sendDeleteDocument(forms: UntypedFormGroup[]) {
    forms.forEach(form => {
      form.disable()
    })
    console.log(this.documentEditBackup)
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_DeleteDocument, {document: this.documentEditBackup}).subscribe(
      (response) => {
        this.handleResponseDocument(response, forms, 'Le document a été supprimé avec succès')
      },
      (error) => {
        this.handleDocumentErrorResponse(error, forms)
      }
    )
  }

  handleResponseDocument(response: Object, forms: UntypedFormGroup[], successMessage: string) {
    this.communicationService.handleResponse(response, successMessage)
    this.generalService.forceUpdateData()
    forms.forEach(form => {
      form.enable()
    })
    this.resetFieldsEditDoc()
  }

  handleDocumentErrorResponse(error: any, forms: UntypedFormGroup[]) {
    this.communicationService.handleErrorResponse(error)
    this.documentEditForm.enable()
    forms.forEach(form => {
      form.enable()
    })
  }

  // ################################### Filter manage ###################################

  filterAddForm: UntypedFormGroup = new UntypedFormGroup({});
  filterAddFormModel: FilterType = {
    type: '',
    filter: '',
    filter_formatted: '',
    page: '',
    engin: ''
  }
  filterEditForm: UntypedFormGroup = new UntypedFormGroup({});
  filterEditFormModel: FilterType = {
    type: '',
    filter: '',
    filter_formatted: '',
    page: '',
    engin: ''
  }
  filterEditBackup: FilterType | undefined

  public get currentFilterSelected() {
    let model = this.filterEditFormModel as any
    return this.dataService.filters.find((filter) => (filter.filter == model.filter_to_modif && filter.type == model.type_to_modif && filter.page == model.page_to_modif && filter.engin == model.engin_to_modif))
  }

  selectFilterToModify() {
    if (!this.currentFilterSelected) {
      this.notif.error('Veuillez remplir tous les champs...')
    }
    this.filterEditBackup = JSON.parse(JSON.stringify(this.currentFilterSelected)) // Make sure that there is a deep copy for each...
    this.filterEditFormModel = _.merge(JSON.parse(JSON.stringify(this.filterEditFormModel)), JSON.parse(JSON.stringify(this.currentFilterSelected)))
  }

  sendEditFilter() {
    this.filterEditForm.disable()
    this.communicationService.requestToAPI('POST', this.communicationService.API_Endpoint_EditFilter, {oldFilter: this.filterEditBackup, newFilter: this.filterEditFormModel}).subscribe(
      (response) => {
        this.filterEditForm.enable()
        this.communicationService.handleResponse(response, 'Le filtre a bien été modifié')
        this.filterEditBackup = undefined
        this.generalService.forceUpdateData()
      },
      (error) => {
        this.filterEditForm.enable()
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  sendCreateFilter() {
    this.filterAddForm.disable()
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_CreateFilter, {filter: this.filterAddFormModel}).subscribe(
      (response) => {
        this.filterAddForm.enable()
        this.communicationService.handleResponse(response, 'Le filtre a bien été crée')
        this.generalService.forceUpdateData()
      },
      (error) => {
        this.filterAddForm.enable()
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  sendDeleteFilter() {
    this.filterEditForm.disable()
    this.communicationService.requestToAPI('POST', this.communicationService.API_Endpoint_DeleteFilter, {filter: this.currentFilterSelected}).subscribe(
      (response) => {
        this.filterEditForm.enable()
        this.communicationService.handleResponse(response, 'Le filtre a bien été supprimé')
        this.generalService.forceUpdateData()
      },
      (error) => {
        this.filterEditForm.enable()
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  // ################################### Engins & Technicentres manage ###################################
  enginTechAddForm: UntypedFormGroup = new UntypedFormGroup({});
  enginTechAddFormModel: any = {}

  technicentreAddForm: UntypedFormGroup = new UntypedFormGroup({});
  technicentreAddFormModel: any = {}

  sendAddEnginTechnicentre() {
    this.enginTechAddForm.disable()
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_CreateEnginTechnicentre, {engin: this.enginTechAddFormModel}).subscribe(
      (response) => {
        this.enginTechAddForm.enable()
        this.communicationService.handleResponse(response, "L'engin a bien été ajouté")
        this.generalService.forceUpdateData()
      },
      (error) => {
        this.enginTechAddForm.enable()
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  sendDeleteEnginTechnicentre(engin: EnginType) {
    this.enginTechAddForm.disable()
    this.communicationService.requestToAPI("POST", this.communicationService.API_Endpoint_DeleteEnginTechnicentre, {engin: engin}).subscribe(
      (response) => {
        this.enginTechAddForm.enable()
        this.communicationService.handleResponse(response, "L'engin a bien été ajouté")
        this.generalService.forceUpdateData()
      },
      (error) => {
        this.enginTechAddForm.enable()
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  sendAddTechnicentre() {
    this.technicentreAddForm.disable()
    this.communicationService.requestToAPI('POST', this.communicationService.API_Endpoint_CreateTechnicentre, {technicentre: this.technicentreAddFormModel}).subscribe(
      (response) => {
        this.technicentreAddForm.enable()
        this.communicationService.handleResponse(response)
        this.generalService.forceUpdateData()
      },
      (error) => {
        this.technicentreAddForm.enable()
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

  sendDeleteTechnicentre(technicentre: TechnicentreType) {
    this.communicationService.requestToAPI('POST', this.communicationService.API_Endpoint_DeleteTechnicentre, {technicentre: technicentre}).subscribe(
      (response) => {
        this.communicationService.handleResponse(response)
        this.generalService.forceUpdateData()
      },
      (error) => {
        this.communicationService.handleErrorResponse(error)
      }
    )
  }

}
