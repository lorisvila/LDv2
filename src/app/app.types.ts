// Type for data in LD Dict
import {Component} from "@angular/core";

export type ItemDataType = {
  page?: string,
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
export type FilterType = {
  filter_formatted: string,
  filter: string,
  page: string,
  type: string
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

// Type for page
export type PageType = {
  title: string,
  title_formatted: string,
  url: string
}
