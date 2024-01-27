// Type for data in LD Dict
export type ItemDataType = {
  page?: string,
  id: number,
  des: string,
  engin: string,
  engin_type: string[],
  ref_main: string,
  url_main: string,
  systeme: string
  type?: string,
  ref_aux?: string, // Paramètres optionnels
  url_aux?: string,
  url_main_file?: string,
  url_aux_file?: string,
}

// Different type -> be able to change the Human name of filters without touching to the items itself (by touching to the filters object)
export type OramaItemDataType = {
  page?: string,
  id: string,
  des: string,
  engin: string,
  engin_type: string[],
  ref_main: string,
  url_main: string,
  ref_aux?: string,
  url_aux?: string,
  url_main_file?: string,
  url_aux_file?: string,
  systeme: {
    filter: string,
    filter_formatted: string
  }
  type?: {
    filter: string,
    filter_formatted: string
  },
}

// Type for systeme element
export type FilterType = {
  filter_formatted: string,
  filter: string,
  page: string,
  type: string,
  engin: string
}

// Type used for the Orama search
export type PageFilters = {
  engin?: string,
  engin_type?: string[],
  engin_num?: string,
  systeme?: string,
  type?: string,
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

export type CacheDataObjectType = {
  documents: ItemDataType[],
  filters: FilterType[],
  engins: AppEnginType[],
  engins_types: {id: number, engin: string, engin_type: string}[], // not used in app
  engins_technicentre: {id: number, num_engin: string, engin: string, engin_type: string, technicentre: string}[], // not used in app
  technicentres: TechnicentreType[],
  news: NewsType[]
}

export type APIresponseAllTables = {
  code: number,
  success: boolean,
  message: string,
  requestTime: string,
  lastRefreshTime: string,
  endpoint: string,
  data: CacheDataObjectType
}

export type LocalStorageDataType = {
  lastCacheDate: string,
  refreshDelayMinutes: number,
  cachedData?: CacheDataObjectType,
  preferences?: {
    defaultEngin: AppEnginType,
    favEngins: EnginType[],
    technicentre: TechnicentreType,
  }
}

export type AppEnginType = {
  engin: string,
  types_engin: string[],
  url_image_engin: string
}
