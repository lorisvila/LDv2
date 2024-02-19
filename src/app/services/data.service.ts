import { Injectable } from '@angular/core';
import {ItemDataType, NewsType, PageType, FilterType, TechnicentreType, AppEnginType} from "../app.types";

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
      types_engin: ["XGC", "BGC", "ZGC"],
      url_image_engin: "AGC_4C.png"
    },
    {
      engin: "TER 2N NG",
      types_engin: ["2C", "3C", "4C", "5C"],
      url_image_engin: "TER2NNG_3C.png"
    },
    {
      engin: "NAT",
      types_engin: ["7C", "8C"],
      url_image_engin: "NAT_7C.png"

    },
    {
      engin: "Regiolis",
      types_engin: ["4C", "6C"],
      url_image_engin: "REGIOLIS_L.png"
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
  filters: FilterType[] = [
    // Page documentation par fonctions
    {filter_formatted: "Afficheurs",                filter: "AFF",         page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Anti-Enrayeurs",            filter: "AE",          page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "ATESS",                     filter: "ATESS",       page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Boucle inductive",          filter: "BI",          page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Chaîne de traction",        filter: "CT",          page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Climatisation",             filter: "CLIM",         page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Comble lacune",             filter: "CL",          page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Coupleur",                  filter: "CMCF",        page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Détection incendie",        filter: "DI",          page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Eclairage & Feux de signalisation", filter: "ECL", page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "EMCO",                      filter: "EMCO",        page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Essuie vitre & Lave glace", filter: "EVLG",        page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Générateur de sons",        filter: "GS",          page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "GPS",                       filter: "GPS",         page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Indicateur de vitesse",     filter: "IV",          page: "docFct", type: "systeme", engin: "AGC"},
    {filter_formatted: "Manipulateur de traction / freinage", filter: "MPCOF", page: "docFct", type: "systeme", engin: "AGC"},

    // Page Livrets de dépannage
    {filter_formatted: "Motrice",             filter: "motrice",            page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Remorque",            filter: "remorque",           page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Généralités",         filter: "generalites",        page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Pneumatique",         filter: "pneumatique",        page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Chaîne de traction",  filter: "chaine_trac",        page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Groupe électrogène",  filter: "groupe_electro",     page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Climatisation",       filter: "clim",               page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Frein AE Prod. air",  filter: "frein_ae_prod_air",  page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Portes",              filter: "portes",             page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "SIE / SIV",           filter: "sie_siv",            page: "ld", type: "systeme", engin: "AGC"},
    {filter_formatted: "Rétro. & Vidéosurv.", filter: "retro_visio",        page: "ld", type: "systeme", engin: "AGC"},

    {filter_formatted: "Schémas",                   filter: "schemas",      page: "ld", type: "type", engin: "AGC"},
    {filter_formatted: "Codes défauts",             filter: "code_defauts", page: "ld", type: "type", engin: "AGC"},
    {filter_formatted: "Logiciel",                  filter: "logiciel",     page: "ld", type: "type", engin: "AGC"},

    // Page modules de formation
    {filter_formatted: "Généralités, Câblages, Systèmes",          filter: "Mod.1",   page: "modulesFormation", type: "systeme", engin: "AGC"},
    {filter_formatted: "Chaîne de traction",                       filter: "Mod.2",   page: "modulesFormation", type: "systeme", engin: "AGC"},
    {filter_formatted: "Système Informatique Embarqué",            filter: "Mod.3",   page: "modulesFormation", type: "systeme", engin: "AGC"},
    {filter_formatted: "Frein pneu, Auxiliaires, Prod air",        filter: "Mod.4",   page: "modulesFormation", type: "systeme", engin: "AGC"},
    {filter_formatted: "Frein AE, Prod Air, E/S",                  filter: "Mod.4b",  page: "modulesFormation", type: "systeme", engin: "AGC"},
    {filter_formatted: "Portes accès, intérieures, comble lacune", filter: "Mod7",    page: "modulesFormation", type: "systeme", engin: "AGC"},
    {filter_formatted: "Commande & Contrôle Moteur Diesel",        filter: "Mod.8b",  page: "modulesFormation", type: "systeme", engin: "AGC"},
    {filter_formatted: "Climatisation",                            filter: "Mod.9",   page: "modulesFormation", type: "systeme", engin: "AGC"},
  ]

  // All the data in one list
  allItemsData: ItemDataType[] = [
    {
      "page": "ld",
      "id": 2,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 02 E01",
      "ref_aux": "05-3 709 829",
      "des": "Schémas de câblage motrice 1 B81500 jusqu’à la rame B81545 (XAB)",
      "type": "schemas",
      "systeme": "GPS",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 829",
      "url_main_file": "assets/documents/LD/LD5200202E01_A-.pdf"
    },
    {
      "page": "ld",
      "id": 3,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 02 E02",
      "ref_aux": "05-3 709 830",
      "des": "Schémas de câblage motrice 1 B81500 à partir de la rame B81547 et B82500 (XAB)",
      "type": "schemas",
      "systeme": "EMCO",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 830",
      "url_main_file": "assets/documents/LD/LD5200202E02_A-.pdf"
    },
    {
      "id": 4,
      "engin": "AGC",
      "engin_type": [
        "XGC",
        "BGC",
        "ZGC"
      ],
      "ref_main": "LD 5 200 1 01",
      "des": "Livret de Dépannage : Définition, Structure",
      "systeme": "generalites",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200101_D-.pdf",
      "url_main_file": "assets/documents/LD/LD5200101_D-.pdf",
      "page": "ld"
    },
    {
      "id": 5,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 02 E01",
      "ref_aux": "05-3 709 829",
      "des": "Schémas de câblage motrice 1 B81500 jusqu’à la rame B81545 (XAB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 829",
      "url_main_file": "assets/documents/LD/LD5200202E01_A-.pdf",
      "page": "ld"
    },
    {
      "id": 6,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 02 E02",
      "ref_aux": "05-3 709 830",
      "des": "Schémas de câblage motrice 1 B81500 à partir de la rame B81547 et B82500 (XAB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 830",
      "url_main_file": "assets/documents/LD/LD5200202E02_A-.pdf",
      "page": "ld"
    },
    {
      "id": 7,
      "engin": "AGC",
      "engin_type": [
        "XGC"
      ],
      "ref_main": "LD 5 200 2 03 E01",
      "ref_aux": "05-3 709 835",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) jusqu’à la rame X76563",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 835",
      "url_main_file": "assets/documents/LD/LD5200203E01_A-.pdf",
      "page": "ld"
    },
    {
      "id": 8,
      "engin": "AGC",
      "engin_type": [
        "XGC"
      ],
      "ref_main": "LD 5 200 2 03 E02",
      "ref_aux": "05-3 709 836",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) à partir de la rame X76575",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 836",
      "url_main_file": "assets/documents/LD/LD5200203E02_A-.pdf",
      "page": "ld"
    },
    {
      "id": 9,
      "engin": "AGC",
      "engin_type": [
        "XGC"
      ],
      "ref_main": "LD 5 200 2 04 E01",
      "ref_aux": "05-3 709 839",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) jusqu’à la rame X76561",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 839",
      "url_main_file": "assets/documents/LD/LD5200204E01_A-.pdf",
      "page": "ld"
    },
    {
      "id": 10,
      "engin": "AGC",
      "engin_type": [
        "XGC"
      ],
      "ref_main": "LD 5 200 2 04 E02",
      "ref_aux": "05-3 709 840",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) à partir de la rame X76565",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 840",
      "url_main_file": "assets/documents/LD/LD5200204E02_A-.pdf",
      "page": "ld"
    },
    {
      "id": 11,
      "engin": "AGC",
      "engin_type": [
        "ZGC"
      ],
      "ref_main": "LD 4 200 2 05 E01",
      "ref_aux": "05-3 712 347",
      "des": "Schémas de câblage Z27500 motrice 1 couplable (ZAC) rame Z27503",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200205E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 347",
      "url_main_file": "assets/documents/LD/LD4200205E01_A-.pdf",
      "page": "ld"
    },
    {
      "id": 12,
      "engin": "AGC",
      "engin_type": [
        "ZGC"
      ],
      "ref_main": "LD 4 200 2 05 E02",
      "ref_aux": "05-3 712 348",
      "des": "Schémas de câblage Z27500 motrice 1 couplable (ZAC) à partir de la rame Z27507",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200205E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 348",
      "url_main_file": "assets/documents/LD/LD4200205E02_A-.pdf",
      "page": "ld"
    },
    {
      "id": 13,
      "engin": "AGC",
      "engin_type": [
        "ZGC"
      ],
      "ref_main": "LD 4 200 2 06 E01",
      "ref_aux": "05-3 712 349",
      "des": "Schémas de câblage Z27500 motrice 1 standard (ZAS) rames Z27501 et Z27505",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200206E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 349",
      "url_main_file": "assets/documents/LD/\tLD4200206E01_A-.pdf",
      "page": "ld"
    },
    {
      "id": 14,
      "engin": "AGC",
      "engin_type": [
        "ZGC"
      ],
      "ref_main": "LD 4 200 2 06 E02",
      "ref_aux": "05-3 712 350",
      "des": "Schémas de câblage Z27500 motrice 1 standard (ZAS) à partir de la rame Z27511",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200206E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 350",
      "url_main_file": "assets/documents/LD/\tLD4200206E02_A-.pdf",
      "page": "ld"
    },
    {
      "id": 15,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 08 E01",
      "ref_aux": "05-3 709 831",
      "des": "Schémas de câblage motrice 2 B81500 jusqu’à la rame B81545 (XBB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200208E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 831",
      "url_main_file": "assets/documents/LD/LD5200208E01_A-.pdf",
      "page": "ld"
    },
    {
      "id": 16,
      "engin": "AGC",
      "engin_type": [
        "ZGC"
      ],
      "ref_main": "LD 4 200 2 16",
      "ref_aux": "05-3 712 355",
      "des": "Schémas de câblage Z27500 remorque 1 (ZRS)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200216_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 355",
      "url_main_file": "assets/documents/LD/LD4200216_A-.pdf",
      "page": "ld"
    },
    {
      "id": 17,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 17",
      "ref_aux": "05-3 714 000",
      "des": "Schémas de câblage B82500 remorque 1 (XRZ)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200217_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 714 000",
      "url_main_file": "assets/documents/LD/LD5200217_A-.pdf",
      "page": "ld"
    },
    {
      "id": 18,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 18",
      "ref_aux": "05-3 709 834",
      "des": "Schémas de câblage B81500 remorque 2 (XSB)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200218_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 834",
      "url_main_file": "assets/documents/LD/LD5200218_A-.pdf",
      "page": "ld"
    },
    {
      "id": 19,
      "engin": "AGC",
      "engin_type": [
        "XGC"
      ],
      "ref_main": "LD 5 200 2 19",
      "ref_aux": "05-3 709 844",
      "des": "Schémas de câblage X76500 remorque 1 (XSS)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200219_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 844",
      "url_main_file": "assets/documents/LD/LD5200219_A-.pdf",
      "page": "ld"
    },
    {
      "id": 20,
      "engin": "AGC",
      "engin_type": [
        "ZGC"
      ],
      "ref_main": "LD 4 200 2 20",
      "ref_aux": "05-3 712 356",
      "des": "Schémas de câblage Z27500 remorque 2 (ZSS)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200220_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 356",
      "url_main_file": "assets/documents/LD/LD4200220_A-.pdf",
      "page": "ld"
    },
    {
      "id": 21,
      "engin": "AGC",
      "engin_type": [
        "BGC"
      ],
      "ref_main": "LD 5 200 2 21",
      "ref_aux": "05-3 714 001",
      "des": "Schémas de câblage B82500 remorque 2 (XSZ)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200221_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 714 001",
      "url_main_file": "assets/documents/LD/LD5200221_A-.pdf",
      "page": "ld"
    },
    {
      "id": 22,
      "engin": "AGC",
      "engin_type": [
        "XGC",
        "BGC",
        "ZGC"
      ],
      "ref_main": "LD 5 200 2 22",
      "des": "Schémas de câblage aménagement",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200222_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200222_A-.pdf",
      "page": "ld"
    },
    {
      "id": 23,
      "engin": "AGC",
      "engin_type": [
        "XGC",
        "BGC",
        "ZGC"
      ],
      "ref_main": "LD 5 200 2 23",
      "des": "Schémas de câblage pneumatique",
      "type": "schemas",
      "systeme": "pneumatique",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200223_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200223_A-.pdf",
      "page": "ld"
    },
    {
      "id": 24,
      "engin": "AGC",
      "engin_type": [
        "XGC",
        "BGC",
        "ZGC"
      ],
      "ref_main": "LD 5 200 1 02",
      "des": "Logiciel « DCU Term »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200102_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200102_A-.pdf",
      "page": "ld"
    },
    {
      "id": 25,
      "engin": "AGC",
      "engin_type": [
        "XGC",
        "BGC",
        "ZGC"
      ],
      "ref_main": "LD 5 200 1 03",
      "des": "Logiciel « MAVIS »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200103_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200103_A-.pdf",
      "page": "ld"
    },
    {
      "id": 26,
      "engin": "AGC",
      "engin_type": [
        "XGC",
        "BGC",
        "ZGC"
      ],
      "ref_main": "LD 5 200 1 04",
      "des": "Logiciel « TDS Uploader »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200104_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200104_A-.pdf",
      "page": "ld"
    }
  ]

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
