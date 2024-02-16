// App Types
export type UserType = {
  lastConnect: number,
  username: string,
  password: string
}

export type ConfigType = {
  auth: {
    mainToken: string,
    expiration: string,
    cookieName: string
  }

  database: {
    user: string,
      password: string,
      server: string,
      database: string,
      port: number
      tables: string[]
  },

  data: {
    refreshRate: number
  }

  webserver: {
      port: number,
      host: string
  },

  adminUsers: UserType[]
}

export type DBconfigType = {
  user: string
  password: string
  server: string
  database: string
  port: number
  options: {
    trustedConnection: boolean
    encrypt: boolean
    enableArithAbort: boolean
    trustServerCertificate: boolean
  }
}
export class AuthResponseType { // Class used as a return object in Auth Module
  code: number = 200 // De base = 200
  message?: string
  username?: string
}
export class RawDataTables {
  documents: []
  filters: []
  engins_types: []
  engins_technicentre: []
  technicentres: []
  news: []
}
export type TableObjectType = {
  tableName: string
  tableData: any
  tableLastRefresh: number
}

// Requests Types
export type ResponseType = {
  date: number // Time as the 32 bits value of time
  data: any
  status: {
    code: number,
    message?: string
  }
  token?: string
}

export type RequestType = {
  data: any
  token?: string,
}

export type AuthConnectRequestType = {
  username: string,
  password: string
}
