import { Injectable } from '@angular/core';
import {
  ItemDataType,
  NewsType,
  PageType,
  FilterType,
  TechnicentreType,
  AppEnginType,
  FilterBaseType
} from "../app.types";

@Injectable({
  providedIn: 'root'
})

//Class containing the data values for the offline mode
export class DataService {

  // to convert Excel to JSON : https://tableconvert.com/excel-to-json
  // to convert XML to JSON : https://codebeautify.org/xmltojson
  // The object Data must match the type ItemDataType described in the app.types.ts file

  // Délai de rafraîchissement
  refreshDelayMinutes = 60

  filterTypes: FilterBaseType[] = []

  // Data for admin Panel
  webPages: PageType[] = [{
      title: "ld",
      title_formatted: "Livrets de dépannages",
      url: "livretDepannage"
    },{
      title: "docFct",
      title_formatted: "Documentation par fonction",
      url: "documentationParFonction"
    },{
      title: "modulesFormation",
      title_formatted: "Modules de formation",
      url: "modulesDeFormation"
    },{
      title: "locOrga",
      title_formatted: "Localisation des organes",
      url: "localisationDesOrganes"
    },{
      title: "codesDef",
      title_formatted: "Codes défauts",
      url: "codesDefauts"
    }
  ]

  // Engins
  engins: AppEnginType[] = [
    {
      engin: "AGC",
      types_engin: ["XGC", "BGC", "ZGC"]
    },
    {
      engin: "TER 2N NG",
      types_engin: ["2C", "3C", "4C", "5C"]
    },
    {
      engin: "NAT",
      types_engin: ["7C", "8C"]

    },
    {
      engin: "Regiolis",
      types_engin: ["4C", "6C"]
    },
  ]

  // Data for Technicentre engins
  technicentres: TechnicentreType[] = [
    {
      technicentre: "TI_BHM",
      technicentre_formatted: "Technicentre Industriel de Bischheim",
      engins: [
        {engin: "AGC", engin_type: "XGC", engin_numero:76533},
        {engin: "AGC", engin_type: "XGC", engin_numero:76519},
        {engin: "AGC", engin_type: "XGC", engin_numero:76529}
      ]
    },
    {
      technicentre: "TI_NEVERS",
      technicentre_formatted: "Technicentre Industriel de Nevers",
      engins: [
        {engin: "AGC", engin_type: "XGC", engin_numero:76505}
      ]
    }
  ]

  // Systemes and types for all the page's filters
  filters: FilterType[] = []

  allItemsData: ItemDataType[] = []

  // List of news
  homePageNews: NewsType[] = [
    {
      title: "Mise en ligne !",
      subtitle: "Le LD v2 vient d'être lancé",
      article_content: "Le LD Interactif v2 vient d'arriver en ligne :), il reste toujours en cours de développement mais est désormais utilisable",
      date: new Date(2023, 12, 23)
    },
    {
      title: "En cours de développement",
      article_content: "Malgré son apparence, le LD Interactif v2 est toujours en cours de développement. Si vous rencontrez un bug ou que vous souhaitez me faire part d'une idée, n'hésitez pas à m'écrire par Teams ou par mail !",
      urls: [
        {
          title: "Contactez-moi",
          url: "mailto:loris.vila@sncf.fr"
        }
      ],
      date: new Date(2023, 12, 25)
    }
  ]

}
