// Type for data in LD Dict
export type LDdataType = {
  id: number,
  des: string,
  engin: string,
  engin_type: string[],
  ref_main: string,
  ref_aux?: string,
  url_main: string,
  url_aux?: string,
  url_main_file?: string,
  url_aux_file?: string,
  type?: string,
  systeme: string
}

// Type for DebugData element
export type DebugDataType = {
  var: string,
  val: string | number | boolean
}
