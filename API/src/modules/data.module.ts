import {App} from "~/server";
import {DBconfigType, NOT_TO_DATE, TableName, TableObjectType, UP_TO_DATE} from "~/types/types";
import {EventEmitter} from 'node:events';
import {Client, connect, DatabaseError, ResultRecord} from "ts-postgres";
import {API_Error} from "~/types/errors";
import * as process from "node:process";
import _ from "lodash";
import {Logger} from "pino";


export class DataModule {

  App: App
  DBconfig: DBconfigType
  lastRefresh: Date = new Date(2000,1,1,0,0,0)
  dbClient: Client
  dbConnected: boolean = false
  dbEvent: EventEmitter = new EventEmitter

  allTables: Map<string, ResultRecord> = new Map<string, ResultRecord>

  logger: Logger

  constructor(mainClass: App) {
    this.App = mainClass
    this.DBconfig = this.App.config.database
    this.logger = this.App.AppLogger.createChildLogger(this.constructor.name)

    this.dbEvent.on('connected', () => {
      this.logger.info('Connected to DB')
      this.cacheData()
    })

    this.dbEvent.on('refreshed', () => {
      this.logger.info('Finished refreshing')
      this.lastRefresh = new Date()
    })

    this.connectToServer()

    setInterval(() => {this.cacheData()}, this.App.config.data.refreshRate * 1000)

  }

  // ########################################
  // Connection to DB section

  async connectToServer() {
    try {
      this.logger.info(`Connecting to DB on ${this.DBconfig.server}:${this.DBconfig.port} with user ${this.DBconfig.user} on db ${this.DBconfig.database}`)
      this.dbClient = await connect({
        host: this.DBconfig.server,
        port: this.DBconfig.port,
        user: this.DBconfig.user,
        password: this.DBconfig.password,
        database: this.DBconfig.database});
      this.dbConnected = true;
      this.dbEvent.emit('connected');
      this.dbClient.on('end', () => {
        this.dbConnected = false
        this.dbEvent.emit('disconnected')
      })
    } catch (error) {
      this.logger.error(error)
      this.logger.warn("Stopping the server...")
      process.exit(2)
    }
  }

  // ########################################
  // Getting tables from DB

  async getAllTables() {
    let allTableFetched = true

    const tablePromises = this.App.config.data.allTableResponse.map(async (tableName: string) => {
      const tableObject = await this.getTable(tableName).catch(() => {
        allTableFetched = false
      })
      return tableObject
    });

    let response = await Promise.all(tablePromises);

    response = response.filter(Boolean); // Filtrer les valeurs nulles ou indéfinies
    if (response.length == 0 || !allTableFetched) {
      throw new API_Error('API_INTERN_ERROR', "Cannot get tables from DB...")
    }
    return response
  }

  async getTable(tableName: string) {
    try {
      let query = await this.dbClient.query(`SELECT * FROM ${tableName}`)
      let jsonData: ResultRecord = [...query]
      let tableObject: TableObjectType = {tableName: tableName, tableData: jsonData, tableLastRefresh: new Date().getTime()}
      if (jsonData) {
        this.allTables.set(tableName, jsonData)
      }
      switch (tableName) {
        case "technicentres": {
          this.populateTechnicentreEnginsObjects()
          break;
        }
        case "engins_technicentre": {
          this.populateTechnicentreEnginsObjects()
          break;
        }
      }
      return tableObject
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof TypeError) {
        this.logger.error(`Erreur lors de la query table ${tableName} |`, error.message)
        throw new API_Error('TABLE_NOT_FOUND', `La table ${tableName} n'a pas été trouvée`, {code: 404})
      } else {
        this.logger.error(error)
      }
    }
  }

  async cacheData() {
    this.DBconfig.tables.forEach((table: string, id: number, arr) => {
      this.getTable(table).then((result) => {
        if (id+1 == arr.length) { this.dbEvent.emit('refreshed') } // Send that all tables has been refreshed if last
      }).catch((error) => {}) // TODO : Make something when there is a error...
    })
  }

  checkIfDataIsUpToDate() {
    let timeDiffInSeconds = ((new Date().getTime() - this.lastRefresh.getTime())/1000)/3600
    if (timeDiffInSeconds >= this.App.config.data.refreshLimit) {
      this.cacheData()
      return NOT_TO_DATE
    } else {
      return UP_TO_DATE
    }
  }

  // ########################################
  // Specific functions for tables

  populateTechnicentreEnginsObjects() {
    if (!(this.allTables.has('engins_technicentre') && this.allTables.has('technicentres'))) {
      return
    }
    let technicentres = this.allTables.get('technicentres') as any[]
    let engins_technicentre = this.allTables.get('engins_technicentre') as any[]

    technicentres.forEach(technicentre => technicentre.engins = undefined)

    engins_technicentre.forEach(engin => {
      let technicentre = technicentres.find(technicentre => technicentre.technicentre == engin.technicentre)
      technicentre.engins = technicentre.engins ? [...technicentre.engins, engin] : [engin]
    })
    this.allTables.set('technicentres', technicentres)
  }

  // ########################################
  // DB entries management (adding / replacing / deleting entries)

  async createEntry(newObject: any, tableName: TableName): Promise<void> {

    let {keysString, valuesString, checkKeysString} = this.getAndCheckKeysAndValues(tableName, newObject)

    let checkQuery = `
        SELECT EXISTS(
            SELECT FROM "${tableName}"
            WHERE ${checkKeysString}
        )
    `
    let checkValue
    try {
      checkValue = await this.dbClient.query(checkQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, checkQuery)
    }

    let checkBool = checkValue?.rows[0][0]
    if (checkBool == true || checkBool == undefined) {
      throw new API_Error('ENTRY_ALREADY_EXISTS', "L'objet que vous souhaitez ajouter existe déjà...", {code: 409})
    }

    let addQuery = `
      INSERT INTO "${tableName}" (${keysString})
      VALUES (${valuesString});
    `

    try {
      await this.dbClient.query(addQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, addQuery)
    }

  }

  async editEntry(oldObject: any, newObject: any, tableName: TableName): Promise<void> {

    let {keysString, valuesString, checkKeysString, tableObject} = this.getAndCheckKeysAndValues(tableName, newObject, oldObject)

    let checkQuery = `
        SELECT EXISTS(
            SELECT FROM "${tableName}"
            WHERE ${checkKeysString}
        )
    `
    let checkValue
    try {
      checkValue = await this.dbClient.query(checkQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, checkQuery)
    }

    let checkBool = checkValue?.rows[0][0]
    if (checkBool == false || checkBool == undefined) {
      throw new API_Error('ENTRY_ALREADY_EXISTS', "L'objet que vous souhaitez éditer n'existe pas...", {code: 409})
    }

    let replaceQuery = `
      UPDATE "${tableName}"
      SET (${keysString}) = (${valuesString})
      WHERE ("${tableObject.idKey}" = '${oldObject[tableObject.idKey]}')
    `

    try {
      await this.dbClient.query(replaceQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, replaceQuery)
    }

  }

  async deleteEntry(object: any, tableName: TableName): Promise<void> {

    let {keysString, valuesString, checkKeysString, tableObject} = this.getAndCheckKeysAndValues(tableName, object)

    let checkQuery = `
        SELECT EXISTS(
            SELECT FROM "${tableName}"
            WHERE (${checkKeysString})
        )
    `
    let checkValue
    try {
      checkValue = await this.dbClient.query(checkQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, checkQuery)
    }

    let checkBool = checkValue?.rows[0][0]
    if (checkBool == false || checkBool == undefined) {
      throw new API_Error('ENTRY_ALREADY_EXISTS', "L'objet que vous souhaitez supprimer n'existe pas...", {code: 409})
    }

    let deleteQuery = `
      DELETE FROM "${tableName}"
      WHERE ("${tableObject.idKey}" = '${object[tableObject.idKey]}')
    `

    try {
      await this.dbClient.query(deleteQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, deleteQuery)
    }

  }

  getAndCheckKeysAndValues(tableName: string, newObject: any, oldObject?: any) {
    let tableObject = this.App.config.data.tablesNecessaryKeys.find(table => table.tableName == tableName)
    if (!tableObject) { // Vérifier si la configuration de la table se trouve bien dans le fichier de config
      throw new API_Error('API_INTERN_ERROR', "La configuration de la table à modifier n'a pas été trouvéé...")
    }

    let keys = tableObject.keys

    if (!keys) {
      throw new API_Error('API_INTERN_ERROR', `La config pour insérer un objet dans la table ${tableName} n'a pas été trouvée...`)
    }

    if (!_.every(keys, _.partial(_.has, newObject))) {
      throw new API_Error('REQUEST_VALUES_MISSING', 'Une / des clés de votre objet est / sont manquantes dans votre requête...', {code: 422})
    }

    let checkKeysString = ''

    if (oldObject) { // Vérification par rapport à un ancien objet dans la BDD

      if (!_.every(tableObject.checkKeys, _.partial(_.has, oldObject))) { // Vérifier si toutes les clés utilisées pour vérifier via l'ancien objet sont présentes
        throw new API_Error('REQUEST_VALUES_MISSING', 'Une / des clés pour vérifier votre objet de référence est / sont manquantes dans votre requête...', {code: 422})
      }

      if (!oldObject[tableObject.idKey]) { // Vérifier la clé correspondant à la colonne de l'id primaire de la table est présente dans l'objet
        throw new API_Error('REQUEST_VALUES_MISSING', `Il manque l'id (${tableObject.idKey}) dans l'objet de référence`)
      }

      checkKeysString = tableObject.checkKeys.map((key: string) => (`"${key}" = '${this.returnFormattedSQLstring(oldObject[key])}'`)).join(' AND ') // Création du string pour le check de l'objet avec un WHERE

    } else { // Vérification en cas d'ajout d'un nouvel objet dans la BDD

      if (!_.every(tableObject.checkKeys, _.partial(_.has, newObject))) {
        throw new API_Error('REQUEST_VALUES_MISSING', 'Une / des clés pour vérifier votre objet est / sont manquantes dans votre requête...', {code: 422})
      }

      if (!newObject[tableObject.idKey] && !tableObject.idAutoIncrement) {
        throw new API_Error('REQUEST_VALUES_MISSING', `Il manque l'id (${tableObject.idKey}) dans le nouvel objet `)
      }

      checkKeysString = tableObject.checkKeys.map((key: string) => (`"${key}" = '${this.returnFormattedSQLstring(newObject[key])}'`)).join(' AND ')
    }

    let values: string[] = []
    keys.forEach((key: keyof typeof newObject) => {
      try {
        values = [...values, typeof newObject[key] == "string" ? newObject[key].replace("'", "''") as string : JSON.stringify(newObject[key]).replace("'", "''")]
      } catch (error) {
        throw new API_Error('API_INTERN_ERROR', "Une erreur est survenue lors de la génération de l'objet...")
      }
    })

    let keysString = '"' + keys.join('", "') + '"'
    let valuesString = "'" + values.join("', '") + "'"

    return {keysString, valuesString, checkKeysString, tableObject}
  }

  catchDataBaseErrror(error: any, queryString: string) {
    if (error instanceof DatabaseError) {
      this.logger.error(error)
      throw new API_Error('DATABASE_ERROR', `Erreur base de donnée : ${error.detail} | Requête : ${queryString}`, {code: 400})
    } else {
      this.logger.error(error)
      throw new API_Error('API_INTERN_ERROR', 'Une erreur interne est survenue...')
    }
  }

  returnFormattedSQLstring(str: any): string | any {
    return typeof str == "string" ? str.replace(/'/g, "''") : str;
  }

}
