import {App} from "~/server";
import {DBconfigType, RawDataTables, TableObjectType} from "~/types/types";
import sql, {IRecordSet} from "mssql";
import {EventEmitter} from 'node:events';


export class DataModule {

  App: App
  DBconfig: DBconfigType
  SQLpool: sql.ConnectionPool
  $dataReady: EventEmitter
  rawTablesData: Map<string, IRecordSet<any>>
  purifiedTablesData: Map<string, any>
  alltablePurified: TableObjectType[]
  lastRefresh: Date

  constructor(mainClass: App) {
    this.App = mainClass
    this.$dataReady = new EventEmitter()
    this.rawTablesData = new Map<string, IRecordSet<any>>()
    this.purifiedTablesData = new Map<string, any>()
    this.alltablePurified = []
    this.DBconfig = {
      user:  mainClass.config.database.user,
      password:  mainClass.config.database.password,
      server:  mainClass.config.database.server,
      database:  mainClass.config.database.database,
      port:  mainClass.config.database.port,
      options: {
        trustedConnection: true,
        encrypt: false,
        enableArithAbort: true,
        trustServerCertificate: true,
      }
    }

    this.connectToServer().catch(() => process.exit(2)).then(r => {
      this.updateAllTable() // It will emit a $dataReadyEvent 'finished' when all tables has been feteched
    })

    this.$dataReady.on('dataFetched', () => {
      this.purifyTables()
      this.$dataReady.emit('finished')
    })

  }

  async connectToServer() {
    this.SQLpool = await sql.connect(this.DBconfig).catch(() => {
      console.error("Erreur lors de la connexion au serveur")
      process.exit(2)
    })
  }

  async getTable(table: string, where?: {id: string, value: string}[]) {
    let queryString = `SELECT * FROM ${table}`
    // Add all the elements of where in the query
    if (where) {
      queryString += ' WHERE'
      for (let i = 0; i < where.length; i++) {
        queryString += ` ${where[i].id}='${where[i].value}'`
        if (i < (where.length - 1)) {
          queryString += ' AND'
        }
      }
    }
    queryString += ';'
    // Make the request
    try {
      let results = (await this.SQLpool.request().query(queryString)).recordset
      if (!results) {
        console.error(`La liste de résultats de la requête ${queryString} est vide...`)
        return null // TODO : See if there is not a better way to return this Promise in case of a error instead of returning a null...
      }
      return await results
    } catch (error) {
      console.error(`Une erreur est survenue sur la requête ${queryString}`, error)
      return null // TODO : See if there is not a better way to return this Promise in case of a error instead of returning a null...
    }
  }

  purifyTables() {

    console.log("Purifying data")

    this.alltablePurified = []
    let timeRefresh = new Date().getTime()

    // Technicentre Purify
    let technicentreData = this.rawTablesData.get("technicentres")
    let engins_technicentreData = this.rawTablesData.get("engins_technicentre")
    if (technicentreData && engins_technicentreData) {
      technicentreData = JSON.parse(JSON.stringify(technicentreData))
      engins_technicentreData = JSON.parse(JSON.stringify(engins_technicentreData))
      technicentreData?.forEach((technicentre: any) => {
        technicentre.engins = []
        engins_technicentreData?.filter((engin: any) => engin.technicentre == technicentre.technicentre).forEach((engin: any) => technicentre.engins.push({engin: engin.engin, engin_type:engin.engin_type, engin_numero: engin.num_engin}))
      })
      this.purifiedTablesData.set("technicentres", technicentreData)
      this.alltablePurified.push({tableName: "technicentres", tableData: technicentreData, tableLastRefresh: timeRefresh})
    }

    // News Purify
    let newsData = this.rawTablesData.get("news")
    if (newsData) {
      newsData = JSON.parse(JSON.stringify(newsData))
      newsData?.forEach((item) => item['urls'] && typeof item['urls'] == "string"  ? item['urls'] = JSON.parse(item['urls']) : null) // Convert JSON stored as text in DB
      this.purifiedTablesData.set("news", newsData)
      this.alltablePurified.push({tableName: "news", tableData: newsData, tableLastRefresh: timeRefresh})
    }

    // Engins Purify
    let enginsData = this.rawTablesData.get("engins")
    let enginsTypesData = this.rawTablesData.get("engins_types")
    if (enginsData && enginsTypesData) {
      let newEngins: any[] = []
      enginsData?.forEach((engin) => {
        let found_types: any[] = []
        enginsTypesData?.forEach((engin_type) => engin_type.engin == engin.engin ? found_types.push(engin_type.engin_type) : null)
        newEngins.push({engin: engin.engin, types_engin: found_types, url_image_engin: engin.url_image_engin})
      })
      this.purifiedTablesData.set("engins", newEngins)
      this.alltablePurified.push({tableName: "engins", tableData: newEngins, tableLastRefresh: timeRefresh})
    }

    // Documents Purify
    let documentsData = this.rawTablesData.get("documents")
    if (documentsData) {
      documentsData = JSON.parse(JSON.stringify(documentsData))
      documentsData?.forEach((item) => item['engin_type'] && typeof item['engin_type'] == "string" ? item['engin_type'] = JSON.parse(item['engin_type']) : null) // Convert JSON stored as text in DB
      this.purifiedTablesData.set("documents", documentsData)
      this.alltablePurified.push({tableName: "documents", tableData: documentsData, tableLastRefresh: timeRefresh})
    }

    // Filters Purify
    let filtersData = this.rawTablesData.get("filters")
    if (filtersData) {
      this.purifiedTablesData.set("filters", filtersData)
      this.alltablePurified.push({tableName: "filters", tableData: filtersData, tableLastRefresh: timeRefresh})
    }

    console.log("Data purified")
    console.log("PurifiedTables available : ", this.purifiedTablesData.keys())
  }

  async updateAllTable() {
    console.log("Updating all data")

    let numOfTables = this.App.config.database.tables.length

    this.App.config.database.tables.forEach((item, index) => {
      this.getTable(item).then(record => {
        if (record) {this.rawTablesData.set(item, record)} // Add the item to Map list

        if (index+1 == numOfTables) { // Say that all tables has been fetched
          console.log("Updated all data")
          console.log("RawTables available : ", this.rawTablesData.keys())
          this.lastRefresh = new Date() // Set the last refresh of all table to now
          this.$dataReady.emit('dataFetched')
        }
      })
    })
  }

  checkIfDataIsUpToDate() {
    let timeDiffInMinutes = ((new Date().getTime() - this.lastRefresh.getTime())/1000)/60
    if (timeDiffInMinutes >= this.App.config.data.refreshRate) {
      this.updateAllTable() // Launch async funct. so the user will have the old data parsed and will need to do another request to have the new one
    }
  }

}
