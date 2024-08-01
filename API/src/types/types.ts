// App Types
import {ItemDataType} from "../../../src/app/app.types";

export type UserType = {
  username: string,
  password: string
  lastConnect?: number,
  role: RoleType
}
export type RoleType = "admin" | "systemier"

export type ConfigType = {
  auth: {
    mainToken: string,
    expiration: string,
    cookieName: string
  }

  database: DBconfigType,

  data: {
    refreshRate: number
    refreshLimit: number
    allTableResponse: string[]
    tablesNecessaryKeys: TableParams[]
  }

  webserver: {
      port: number,
      host: string
  },

  roles: {[role: string]: number}
  users: UserType[]
}

export type DBconfigType = {
  user: string
  password: string
  server: string
  database: string
  port: number
  tables: string[]
}

export type TableParams = {
  tableName: TableName
  keys: string[]
}
export type TableName = string

// Data Types

export const UP_TO_DATE = true
export const NOT_TO_DATE = false

// Auth Types
export type AuthUsername = string

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

export type TableObjectType = {
  tableName: string
  tableData: any
  tableLastRefresh: number
}
