//------------------------------
// Type for data in LD Dict
export type ItemDataType = {
  page?: string,
  id: number,
  name?: string, // Modify the optionnal parameter
  engin: string,
  engin_type: string[],
  ref_main: string,
  links?: LinkType[] // NEW TO IMPLEMENT
  meta?: FilterType[] // NEW TO IMPLEMENT
  tags?: string[] // NEW TO IMPLEMENT

  des?: string, // OLD
  url_main?: string, // OLD
  systeme?: string // OLD
  type?: string, // OLD
  ref_aux?: string, // OLD
  url_aux?: string, // OLD
  url_main_file?: string, // OLD
  url_aux_file?: string, // OLD
}

// Different type -> be able to change the Human name of filters without touching to the items itself (by touching to the filters object)
export type OramaItemDataType = {
  id: string
  name: string
  engin: string
  engin_type: string[]
  tags: string[]
  page?: string
  meta: FilterType[]
  links: LinkType[]
  ref_main: string
}

export type LinkType = {
  url: string
  name: string
  type: string
}

// Type for system element
export type FilterType = {
  id?: number
  engin: string
  page: string
  type: string
  filter_formatted: string
  filter: string
}
export type FilterBaseType = {
  type: string
  type_formatted: string
}
export type EditingCreatingType = 'CREATING' | 'EDITING'

// Type used for the Orama search
export type PageFilters = {
  engin?: string,
  engin_type?: string[],
  engin_num?: string,
  meta?: {[Name: string]: FilterType},
  page?: string
}

//Type for Technicentres and their engins
export type TechnicentreType = {
  technicentre_formatted: string,
  technicentre: string,
  engins: EnginType[]
}

// Type to define a engin
export type EnginType = {
  engin: string,
  engin_type: string,
  engin_numero?: number // A voir si utilisation d'un integer ou d'un string
}

//Type for the news Object
export type NewsType = {
  title: string,
  subtitle?: string,
  article_content: string,
  urls?: {
    title: string
    url: string
  }[],
  date: Date
}

// Type for page
export type PageType = {
  title: string,
  title_formatted: string,
  url: string
}

export type CachedDataTableType = {
  tableName: string
  tableData: any
  tableLastRefresh: number
}

export type LocalStorageDataType = {
  lastCacheDate: number,
  refreshDelayMinutes: number,
  cachedData?: CachedDataTableType[]
}

export type AppEnginType = {
  engin: string,
  types_engin: string[]
}

export class API_RequestType {
  token?: string
  data?: any
}

export type API_ResponseType = {
  date: number // Time as the 32 bits value of time
  data: any
  status: {
    code: number,
    message?: string
  }
  token?: string
}

export type UserType = {
  username: string,
  password: string
  lastConnect?: number,
  role: RoleType
}
export type RoleType = "admin" | "systemier"
