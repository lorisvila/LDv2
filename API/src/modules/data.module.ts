import {App} from "~/server";
import {DBconfigType, NOT_TO_DATE, TableName, TableObjectType, UP_TO_DATE} from "~/types/types";
import {EventEmitter} from 'node:events';
import * as console from "node:console";
import {Client, connect, DatabaseError, ResultRecord} from "ts-postgres";
import {API_Error} from "~/types/errors";
import * as process from "node:process";
import _ from "lodash";


export class DataModule {

  App: App
  DBconfig: DBconfigType
  lastRefresh: Date = new Date(2000,1,1,0,0,0)
  dbClient: Client
  dbConnected: boolean = false
  dbEvent: EventEmitter = new EventEmitter

  allTables: Map<string, ResultRecord> = new Map<string, ResultRecord>

  constructor(mainClass: App) {
    this.App = mainClass
    this.DBconfig = mainClass.config.database

    this.dbEvent.on('connected', () => {
      console.log('Connected to DB')
      this.cacheData()
    })

    this.dbEvent.on('refreshed', () => {
      console.log('Finished refreshing')
      this.lastRefresh = new Date()
    })

    this.connectToServer()

    setInterval(() => {this.cacheData()}, this.App.config.data.refreshRate * 1000)

  }

  // ########################################
  // Connection to DB section

  async connectToServer() {
    console.log("Connecting to DB")
    try {
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
      console.error(error)
      console.log("Stopping the server...")
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
      return tableObject
    } catch (error) {
      if (error instanceof DatabaseError || error instanceof TypeError) {
        console.error(`Erreur lors de la query table ${tableName} |`, error.message)
        throw new API_Error('TABLE_NOT_FOUND', `La table ${tableName} n'a pas été trouvée`, {code: 404})
      } else {
        console.error(error)
      }
    }
  }

  async cacheData() {
    this.DBconfig.tables.forEach((table: string, id: number, arr) => {
      this.getTable(table).then((result) => {
        if (id+1 == arr.length) { this.dbEvent.emit('refreshed') } // Send that all tables has been refreshed if last
        if (result) { this.allTables.set(table, result) }
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
  // DB entries management (adding / replacing / deleting entries)

  async createEntry(newObject: any, tableName: TableName): Promise<void> {

    let [keysString, valuesString] = this.getKeysAndValuesFormatted(tableName, newObject)

    let checkQuery = `
        SELECT EXISTS(
            SELECT FROM "${tableName}"
            WHERE (engin = '${newObject.engin}' AND (name = '${newObject.name}' OR ref_main = '${newObject.ref_main}'))
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

  async modifyEntry(oldObject: any, newObject: any, tableName: TableName, objectIdKey: string): Promise<void> {

    let [keysString, valuesString] = this.getKeysAndValuesFormatted(tableName, newObject, oldObject)
    if (!oldObject[objectIdKey]) {
      throw new API_Error('API_INTERN_ERROR', "ID de l'objet à modifier non trouvé dans votre requête...")
    }

    let checkQuery = `
        SELECT EXISTS(
            SELECT FROM "${tableName}"
            WHERE (${objectIdKey} = '${oldObject[objectIdKey]}')
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
      WHERE (${objectIdKey} = ${oldObject[objectIdKey]})
    `

    try {
      await this.dbClient.query(replaceQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, replaceQuery)
    }

  }

  async deleteEntry(object: any, tableName: TableName, objectIdKey: string): Promise<void> {

    if (!object[objectIdKey]) {
      throw new API_Error('API_INTERN_ERROR', "ID de l'objet à modifier non trouvé dans votre requête...")
    }

    let checkQuery = `
        SELECT EXISTS(
            SELECT FROM "${tableName}"
            WHERE (${objectIdKey} = '${object[objectIdKey]}')
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
      WHERE (${objectIdKey} = ${object[objectIdKey]})
    `

    try {
      await this.dbClient.query(deleteQuery)
    } catch (error) {
      this.catchDataBaseErrror(error, deleteQuery)
    }

  }

  getKeysAndValuesFormatted(tableName: string, newObject: any, otherObject?: any) {
    let keys = this.App.config.data.tablesNecessaryKeys.find(table => table.tableName == tableName)?.keys
    if (!keys) {
      throw new API_Error('API_INTERN_ERROR', `La config pour insérer un objet dans la table ${tableName} n'a pas été trouvée...`)
    }
    if (!_.every(keys, _.partial(_.has, newObject))) {
      throw new API_Error('REQUEST_VALUES_MISSING', 'Une / des clés de votre objet est / sont manquantes dans votre requête...', {code: 401})
    }
    if (otherObject) {
      if (!_.every(keys, _.partial(_.has, otherObject))) {
        throw new API_Error('REQUEST_VALUES_MISSING', 'Une / des clés de votre objet est / sont manquantes dans votre requête...', {code: 401})
      }
    }

    let values: string[] = []
    keys.forEach((key: keyof typeof newObject) => {
      try {
        values = [...values, typeof newObject[key] == "string" ? newObject[key] as string : JSON.stringify(newObject[key])]
      } catch (error) {
        throw new API_Error('API_INTERN_ERROR', "Une erreur est survenue lors de la génération de l'objet...")
      }
    })

    let keysString = '"' + keys.join("\", \"") + '"'
    let valuesString = "'" + values.join("', '") + "'"

    return [keysString, valuesString]
  }

  catchDataBaseErrror(error: any, queryString: string) {
    if (error instanceof DatabaseError) {
      throw new API_Error('DATABASE_ERROR', `Erreur base de donnée : ${error.detail} | Requête : ${queryString}`, {code: 400})
    } else {
      console.error(error)
      throw new API_Error('API_INTERN_ERROR', 'Une erreur interne est survenue...')
    }
  }

}
