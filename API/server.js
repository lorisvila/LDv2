const express = require("express");
const ini = require("ini");
const sql = require("mssql");
const fs = require("fs");

/*Functions to dialog with the MS SQL Server*/
async function connectToDB() {
  try {
    let pool = await sql.connect(DBconfig)
    return await pool
  } catch (error) {
    console.error(error)
    return null
  }
}
async function getTableFromDB(table, whereId=undefined, whereValue=undefined) {
  let queryString = "SELECT * FROM " + table
  if (whereId && whereValue) {
    queryString = queryString + " WHERE " + whereId + " = " + whereValue
  }
  try {
    let results = (await pool.request().query(queryString)).recordset
    if (!results) {
      console.error("La liste de résultats est vide...")
      return null
    }
    return (await results)
  } catch (error) {
    console.error(error)
    return null
  }
}
async function updateAllData() {
  // Update the cachedData data from the tables listed in the config.ini file
  for (let key of Object.keys(config.tables)) {
    log("Caching : " + key)
    let queryResults = await getTableFromDB(key)
    if (queryResults) {
      cachedData[key] = queryResults
    }
  }
  lastRefreshAllData = new Date()
}

/*Express define paths function*/
function definePathExpress() {

  app.get('/reload', function (req, res) {
    let response = generateResponseObject(req.url)
    refreshDataIfAskedInRequest(req, response, true)
    sendJSONresponse(res, response)
    logRequest(req, response)
  })

  app.get('/allTables', function (req, res) {
    let response = generateResponseObject(req.url)
    refreshDataIfAskedInRequest(req, response)
    response.data = cachedData
    sendJSONresponse(res, response)
    logRequest(req, response)
  })

  app.get('/table/:table', function (req, res) {
    let response = generateResponseObject(req.url)
    refreshDataIfAskedInRequest(req, response)
    if (cachedData[req.params.table]) {
      response.data = cachedData[req.params.table]
    } else {
      response.code = 404
      response.success = false
      response.message = "The table " + req.params.table + " was not found..."
    }
    sendJSONresponse(res, response)
    logRequest(req, response)
  })

  app.all('*', function (req, res) {
    let response = generateResponseObject(req.url)
    response.code = 404
    response.success = false
    response.message = "L'endpoint " + req.url + " n'existe pas..."
    sendJSONresponse(res, response)
    logRequest(req, response)
  })

}

function refreshDataIfAskedInRequest(req, response, bypassReloadParam=false) {
  let timeBtwLastRefresh = giveSecondsDifferenceFromNow(lastRefreshAllData)
  if (req.query.reload === "true" || bypassReloadParam) { // Refresh data if user forces to
    if (giveSecondsDifferenceFromNow(lastRefreshAllData) > limit_refresh_seconds) {
      log("Reloading all data manually asked")
      updateAllData()
    } else {
      response.code = 429
      response.success = false
      response.message = "Too many requests asking to reload, last refresh was " + timeBtwLastRefresh +
        " seconds ago. Limit is currently of " + limit_refresh_seconds + " seconds. You will receive last cached data"
    }
  } else if (giveMinutesDifferenceFromNow(lastRefreshAllData) > normal_refresh_minutes) { // Reload data if refreshrate
    log("Reloading all data after " + normal_refresh_minutes + " minutes")
    updateAllData()
  }
}
function sendJSONresponse(res, response) {
  res.set({
    "Host": "LDv2.mt.sncf.fr",
    "Content-Type": "application/json",
    "User-Agent": "LDv2_API/1.01"
  })
  res.send(response)
}
function giveMinutesDifferenceFromNow(date) {
  return ((new Date() - date)/1000/60)
}
function giveSecondsDifferenceFromNow(date) {
  return ((new Date() - date)/1000)
}
function logRequest(req, response) {
  log("|- " + req.hostname + " - " + req.ip + " -|- " + req.url +
    " -|- " + response.code + " - " + response.message + " -|")
}
function generateResponseObject(endpoint=undefined) {
  return {
    code: 200,
    requestTime: new Date().toJSON(),
    lastRefreshTime: lastRefreshAllData.toJSON(),
    endpoint: endpoint,
    success: true,
    message: undefined,
    data: undefined
  }
}

/*Main function*/
async function main() {
  log("##### API LDv2 #####")
  pool = await connectToDB()
  if (pool === null) { // Quit if the script cannot reach the SQL Server
    process.exit(2)
  }

  await updateAllData()

  process.on('SIGINT', () => { // Close properly the connection to the ms sql DB on SIGINT
    log("Closing")
    pool.close()
    process.exit(0)
  })

  definePathExpress()
  app.disable('x-powered-by')
  app.listen(config.script.API_port, () => log("Listening on port " + config.script.API_port))
}

/*Main Variables*/
const opts = {
  errorEventName:'error',
  logDirectory: __dirname + '/logs', // NOTE: folder must exist and be writable...
  fileNamePattern:'logs_LDv2_<DATE>.log',
  dateFormat:'YYYY.MM.DD'
};
const logger = require('simple-node-logger').createRollingFileLogger( opts );
const log = function (text) {
  logger.info(text)
  console.log(text)
}
var config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'))
var pool = undefined
var cachedData = {}
var lastRefreshAllData = undefined
var normal_refresh_minutes = config.script.normal_refresh_minutes
var limit_refresh_seconds = config.script.limit_refresh_seconds
const DBconfig = {
  user:  config.database.user, // Get the data from the config.ini file
  password:  config.database.password,
  server:  config.database.server,
  database:  config.database.database,
  port:  Number.parseInt(config.database.port),
  options: {
    trustedConnection: true,
    encrypt: false,
    enableArithAbort: true,
    trustServerCertificate: true,
  },
}
var app = express();

/* Main Code execution*/
main()
