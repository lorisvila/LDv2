// Type for data in LD Dict
export type ItemDataType = {
  id: number,
  des: string,
  engin: string,
  engin_type: string[],
  ref_main: string,
  url_main: string,
  systeme: string
  ref_aux?: string, // Paramètres optionnels
  url_aux?: string,
  url_main_file?: string,
  url_aux_file?: string,
  type?: string,
}

// Type for systeme element
export type SystemeType = {
  systeme_formatted: string,
  systeme: string
}

// Type for shortcut element
export type ShortcutType = {
  shortcut_formatted: string,
  shortcut: string
}

//Type for Technicentres and their engins
export type Technicentre = {
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
  content: string,
  urls?: {
    title: string
    url: string
  }[]
}
