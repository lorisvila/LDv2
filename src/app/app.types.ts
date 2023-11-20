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

// Type for DebugData element
export type DebugDataType = {
  var: string,
  val: string | number | boolean
}
