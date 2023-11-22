import { Injectable } from '@angular/core';
import {ItemDataType, ShortcutType, SystemeType, Technicentre} from "../app.types";

@Injectable({
  providedIn: 'root'
})

//Class containing the data values for the offline mode
export class DataService {

  // to convert Excel to JSON : https://tableconvert.com/excel-to-json
  // to convert XML to JSON : https://codebeautify.org/xmltojson
  // The object must match the type ItemDataType described in the app.types.ts file

  // Data for Technicentre engins
  technicentresEngins: Technicentre[] = [
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

  // Objects for LD Page
  systemesLD: SystemeType[] = [
    {"systeme_formatted": "Motrice",            "systeme": "motrice"},
    {"systeme_formatted": "Remorque",           "systeme": "remorque"},
    {"systeme_formatted": "Généralités",        "systeme": "generalites"},
    {"systeme_formatted": "Pneumatique",        "systeme": "pneumatique"},
    {"systeme_formatted": "Chaîne de traction", "systeme": "chaine_trac"},
    {"systeme_formatted": "Groupe électrogène", "systeme": "groupe_electro"},
    {"systeme_formatted": "Climatisation",      "systeme": "clim"},
    {"systeme_formatted": "Frein AE Prod. air", "systeme": "frein_ae_prod_air"},
    {"systeme_formatted": "Portes",             "systeme": "portes"},
    {"systeme_formatted": "SIE / SIV",          "systeme": "sie_siv"},
    {"systeme_formatted": "Rétro. & Vidéosurv.","systeme": "retro_visio"}
  ]
  shortcutsLD: ShortcutType[] = [
    {"shortcut_formatted": "Schémas", "shortcut": "schemas"},
    {"shortcut_formatted": "Codes défauts", "shortcut": "code_defauts"},
    {"shortcut_formatted": "Logiciel", "shortcut": "logiciel"},
  ]

  // Objects for DocFctPage
  systemesDocFct: SystemeType[] = [
    {"systeme_formatted": "Afficheurs",         "systeme": "AFF"},
    {"systeme_formatted": "Anti-Enrayeurs",     "systeme": "AE"},
    {"systeme_formatted": "ATESS",              "systeme": "ATESS"},
    {"systeme_formatted": "Boucle inductive",   "systeme": "BI"},
    {"systeme_formatted": "Chaîne de traction", "systeme": "CT"},
    {"systeme_formatted": "Climatisation",      "systeme": "CLM"},
    {"systeme_formatted": "Comble lacune",      "systeme": "CL"},
    {"systeme_formatted": "Coupleur",           "systeme": "CMCF"},
    {"systeme_formatted": "Détection incendie", "systeme": "DI"},
    {"systeme_formatted": "Eclairage & Feux de signalisation", "systeme": "ECL"},
    {"systeme_formatted": "EMCO",               "systeme": "EMCO"},
    {"systeme_formatted": "Essuie vitre & Lave glace", "systeme": "EVLG"},
    {"systeme_formatted": "Générateur de sons", "systeme": "GS"},
    {"systeme_formatted": "GPS",                "systeme": "GPS"},
    {"systeme_formatted": "Indicateur de vitesse", "systeme": "IV"},
    {"systeme_formatted": "Manipulateur de traction / freinage", "systeme": "MPCOF"}
  ]

  // Objects for Modules Formation
  systemesModuleFormation: SystemeType[] = [
    {"systeme_formatted": "Généralités, Câblages, Systèmes",          "systeme": "Mod.1"},
    {"systeme_formatted": "Chaîne de traction",                       "systeme": "Mod.2"},
    {"systeme_formatted": "Système Informatique Embarqué",            "systeme": "Mod.3"},
    {"systeme_formatted": "Frein pneu, Auxiliaires, Prod air",        "systeme": "Mod.4"},
    {"systeme_formatted": "Frein AE, Prod Air, E/S",                  "systeme": "Mod.4b"},
    {"systeme_formatted": "Portes accès, intérieures, comble lacune", "systeme": "Mod7"},
    {"systeme_formatted": "Commande & Contrôle Moteur Diesel",        "systeme": "Mod.8b"},
    {"systeme_formatted": "Climatisation",                            "systeme": "Mod.9"},
  ]

  //TODO : Compile all the data into 1 list to be able to use the search method

  // Data for LD Page
  LDdata: ItemDataType[] = [
    {
      "id": 1,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 01",
      "des": "Livret de Dépannage : Définition, Structure",
      "systeme": "generalites",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200101_D-.pdf",
      "url_main_file": "assets/documents/LD/LD5200101_D-.pdf"
    },
    {
      "id": 2,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 02 E01",
      "ref_aux": "05-3 709 829",
      "des": "Schémas de câblage motrice 1 B81500 jusqu’à la rame B81545 (XAB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 829",
      "url_main_file": "assets/documents/LD/LD5200202E01_A-.pdf"
    },
    {
      "id": 3,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 02 E02",
      "ref_aux": "05-3 709 830",
      "des": "Schémas de câblage motrice 1 B81500 à partir de la rame B81547 et B82500 (XAB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200202E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 830",
      "url_main_file": "assets/documents/LD/LD5200202E02_A-.pdf"
    },
    {
      "id": 4,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E01",
      "ref_aux": "05-3 709 835",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) jusqu’à la rame X76563",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 835",
      "url_main_file": "assets/documents/LD/LD5200203E01_A-.pdf"
    },
    {
      "id": 5,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E02",
      "ref_aux": "05-3 709 836",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) à partir de la rame X76575",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 836",
      "url_main_file": "assets/documents/LD/LD5200203E02_A-.pdf"
    },
    {
      "id": 6,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 04 E01",
      "ref_aux": "05-3 709 839",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) jusqu’à la rame X76561",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 839",
      "url_main_file": "assets/documents/LD/LD5200204E01_A-.pdf"
    },
    {
      "id": 7,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 04 E02",
      "ref_aux": "05-3 709 840",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) à partir de la rame X76565",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 840",
      "url_main_file": "assets/documents/LD/LD5200204E02_A-.pdf"
    },
    {
      "id": 8,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 05 E01",
      "ref_aux": "05-3 712 347",
      "des": "Schémas de câblage Z27500 motrice 1 couplable (ZAC) rame Z27503",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200205E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 347",
      "url_main_file": "assets/documents/LD/LD4200205E01_A-.pdf"
    },
    {
      "id": 9,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 05 E02",
      "ref_aux": "05-3 712 348",
      "des": "Schémas de câblage Z27500 motrice 1 couplable (ZAC) à partir de la rame Z27507",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200205E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 348",
      "url_main_file": "assets/documents/LD/LD4200205E02_A-.pdf"
    },
    {
      "id": 10,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 06 E01",
      "ref_aux": "05-3 712 349",
      "des": "Schémas de câblage Z27500 motrice 1 standard (ZAS) rames Z27501 et Z27505",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200206E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 349",
      "url_main_file": "assets/documents/LD/\tLD4200206E01_A-.pdf"
    },
    {
      "id": 11,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 06 E02",
      "ref_aux": "05-3 712 350",
      "des": "Schémas de câblage Z27500 motrice 1 standard (ZAS) à partir de la rame Z27511",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200206E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 350",
      "url_main_file": "assets/documents/LD/\tLD4200206E02_A-.pdf"
    },
    {
      "id": 12,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 08 E01",
      "ref_aux": "05-3 709 831",
      "des": "Schémas de câblage motrice 2 B81500 jusqu’à la rame B81545 (XBB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200208E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 831",
      "url_main_file": "assets/documents/LD/LD5200208E01_A-.pdf"
    },
    {
      "id": 13,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 08 E02",
      "ref_aux": "05-3 709 832",
      "des": "Schémas de câblage motrice 2 B81500 à partir de la rame B81547 et B82500 (XBB)",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD5200208E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 832",
      "url_main_file": "assets/documents/LD/\tLD5200208E02_A-.pdf"
    },
    {
      "id": 14,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 09 E01",
      "ref_aux": "05-3 709 837",
      "des": "Schémas de câblage X76500 motrice 2 couplable (XBC) jusqu’à la rame X76563",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD5200209E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 837",
      "url_main_file": "assets/documents/LD/\tLD5200209E01_A-.pdf"
    },
    {
      "id": 15,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 09 E02",
      "ref_aux": "05-3 709 838",
      "des": "Schémas de câblage X76500 motrice 2 couplable (XBC) à partir de la rame X76575",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200209E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 838",
      "url_main_file": "assets/documents/LD/LD5200209E02_A-.pdf"
    },
    {
      "id": 16,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 10 E01",
      "ref_aux": "05-3 709 841",
      "des": "Schémas de câblage X76500 motrice 2 standard (XBS) jusqu’à la rame X76561",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD5200210E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 841",
      "url_main_file": "assets/documents/LD/\tLD5200210E01_A-.pdf"
    },
    {
      "id": 17,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 10 E02",
      "ref_aux": "05-3 709 842",
      "des": "Schémas de câblage X76500 motrice 2 standard (XBS) à partir de la rame X76565",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD5200210E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 842",
      "url_main_file": "assets/documents/LD/\tLD5200210E02_A-.pdf"
    },
    {
      "id": 18,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 11 E01",
      "ref_aux": "05-3 712 351",
      "des": "Schémas de câblage Z27500 motrice 2 couplable (ZBC) rame Z27503",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200211E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 351",
      "url_main_file": "assets/documents/LD/\tLD4200211E01_A-.pdf"
    },
    {
      "id": 19,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 11 E02",
      "ref_aux": "05-3 712 352",
      "des": "Schémas de câblage Z27500 motrice 2 couplable (ZBC) à partir de la rame Z27507",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200211E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 352",
      "url_main_file": "assets/documents/LD/\tLD4200211E02_A-.pdf"
    },
    {
      "id": 20,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 12 E01",
      "ref_aux": "05-3 712 353",
      "des": "Schémas de câblage Z27500 motrice 2 standard (ZBS) rames Z27501 et Z27505",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200212E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 353",
      "url_main_file": "assets/documents/LD/\tLD4200212E01_A-.pdf"
    },
    {
      "id": 21,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 12 E02",
      "ref_aux": "05-3 712 354",
      "des": "Schémas de câblage Z27500 motrice 2 standard (ZBS) à partir de la rame Z27511",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/\tLD4200212E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 354",
      "url_main_file": "assets/documents/LD/\tLD4200212E02_A-.pdf"
    },
    {
      "id": 22,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 14",
      "ref_aux": "05-3 709 833",
      "des": "Schémas de câblage B81500 remorque 1 (XRB)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200214_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 833",
      "url_main_file": "assets/documents/LD/LD5200214_A-.pdf"
    },
    {
      "id": 23,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 15",
      "ref_aux": "05-3 709 843",
      "des": "Schémas de câblage X76500 remorque 1 (XRS)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200215_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 843",
      "url_main_file": "assets/documents/LD/LD5200215_A-.pdf"
    },
    {
      "id": 24,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 16",
      "ref_aux": "05-3 712 355",
      "des": "Schémas de câblage Z27500 remorque 1 (ZRS)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200216_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 355",
      "url_main_file": "assets/documents/LD/LD4200216_A-.pdf"
    },
    {
      "id": 25,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 17",
      "ref_aux": "05-3 714 000",
      "des": "Schémas de câblage B82500 remorque 1 (XRZ)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200217_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 714 000",
      "url_main_file": "assets/documents/LD/LD5200217_A-.pdf"
    },
    {
      "id": 26,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 18",
      "ref_aux": "05-3 709 834",
      "des": "Schémas de câblage B81500 remorque 2 (XSB)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200218_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 834",
      "url_main_file": "assets/documents/LD/LD5200218_A-.pdf"
    },
    {
      "id": 27,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 19",
      "ref_aux": "05-3 709 844",
      "des": "Schémas de câblage X76500 remorque 1 (XSS)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200219_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 844",
      "url_main_file": "assets/documents/LD/LD5200219_A-.pdf"
    },
    {
      "id": 28,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 20",
      "ref_aux": "05-3 712 356",
      "des": "Schémas de câblage Z27500 remorque 2 (ZSS)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200220_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 356",
      "url_main_file": "assets/documents/LD/LD4200220_A-.pdf"
    },
    {
      "id": 29,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 2 21",
      "ref_aux": "05-3 714 001",
      "des": "Schémas de câblage B82500 remorque 2 (XSZ)",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200221_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 714 001",
      "url_main_file": "assets/documents/LD/LD5200221_A-.pdf"
    },
    {
      "id": 30,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 2 22",
      "des": "Schémas de câblage aménagement",
      "type": "schemas",
      "systeme": "remorque",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200222_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200222_A-.pdf"
    },
    {
      "id": 31,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 2 23",
      "des": "Schémas de câblage pneumatique",
      "type": "schemas",
      "systeme": "pneumatique",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200223_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200223_A-.pdf"
    },
    {
      "id": 32,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 02",
      "des": "Logiciel « DCU Term »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200102_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200102_A-.pdf"
    },
    {
      "id": 33,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 03",
      "des": "Logiciel « MAVIS »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200103_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200103_A-.pdf"
    },
    {
      "id": 34,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 04",
      "des": "Logiciel « TDS Uploader »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200104_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200104_A-.pdf"
    },
    {
      "id": 35,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 05",
      "des": "Logiciel « EMCO Logiplus »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200105_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200105_A-.pdf"
    },
    {
      "id": 36,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 06",
      "des": "Logiciel « EMCO Faiveley »",
      "type": "logiciel",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200106_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200106_A-.pdf"
    },
    {
      "id": 37,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 07",
      "des": "Utilisation des enregistreurs PCU / DCU",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200107_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200107_A-.pdf"
    },
    {
      "id": 38,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 08",
      "des": "Configuration Fiche MOBAD avec « Map Tools »",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200108_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200108_A-.pdf"
    },
    {
      "id": 39,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 09",
      "des": "Chargement Base Line, Carte DCU, Carte PCU avec « DCU Term »",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200109_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200109_A-.pdf"
    },
    {
      "id": 40,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 10",
      "des": "Chargement Carte GDU avec programmateur XILINX",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200110_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200110_A-.pdf"
    },
    {
      "id": 41,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 11",
      "des": "Codes défaut et procédure de recherche de pannes XGC (X Std)",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200111_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200111_A-.pdf"
    },
    {
      "id": 42,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 1 12",
      "des": "Codes défaut et procédure de recherche de pannes BGC (X Bim)",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200112_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200112_A-.pdf"
    },
    {
      "id": 43,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 1 13",
      "des": "Codes défaut et procédure de recherche de pannes ZGC (Z Std)",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200113_A-.pdf",
      "url_main_file": "assets/documents/LD/LD4200113_A-.pdf"
    },
    {
      "id": 44,
      "engin": "AGC",
      "engin_type": ['BGC'],
      "ref_main": "LD 5 200 1 14",
      "des": "Codes défaut et procédure de recherche de pannes BiBi (X Bibi)",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200114_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200114_A-.pdf"
    },
    {
      "id": 45,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 16",
      "des": "Haute tension : Fonctionnement - Génération des codes défaut type H",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200116_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200116_A-.pdf"
    },
    {
      "id": 46,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 17",
      "des": "Communications: Fonctionnement – Génération des codes défaut type C",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200117_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200117_A-.pdf"
    },
    {
      "id": 47,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 18",
      "des": "Propulsion: Fonctionnement – Génération des codes défaut type P",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200118_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200118_A-.pdf"
    },
    {
      "id": 48,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 19",
      "des": "Freinage conjugé: Fonctionnement – Génération des codes défaut type B",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200119_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200119_A-.pdf"
    },
    {
      "id": 49,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 20",
      "des": "Fonctionnement du train : Fonctionnement – Génération des codes défaut type M",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200120_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200120_A-.pdf"
    },
    {
      "id": 50,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 21",
      "des": "Emetteur de consigne FAIVELEY : Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200121_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200121_A-.pdf"
    },
    {
      "id": 51,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 22",
      "des": "Emetteur de consigne LOGIPLUS: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200122_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200122_A-.pdf"
    },
    {
      "id": 52,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 23",
      "des": "Module convertisseur moteur (MCM) : Fonctionnement – Génération des codes défaut type DCUM",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200123_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200123_A-.pdf"
    },
    {
      "id": 53,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 24",
      "des": "Module convertisseur Générateur (GCM) : Fonctionnement – Génération des codes défaut type DCUG",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200124_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200124_A-.pdf"
    },
    {
      "id": 54,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 25",
      "des": "Module convertisseur Auxiliaire (ACM) : Fonctionnement – Génération des codes défaut type DCUA",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200125_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200125_A-.pdf"
    },
    {
      "id": 55,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 4 200 1 26",
      "des": "Module convertisseur de ligne (LCM) : Fonctionnement – Génération des codes défaut type DCUL",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200126_A-.pdf",
      "url_main_file": "assets/documents/LD/LD4200126_A-.pdf"
    },
    {
      "id": 56,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 27",
      "des": "Module convertisseur de ligne/générateur (LGCM) : Fonctionnement – Génération des codes défaut type DCULG",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200127_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200127_A-.pdf"
    },
    {
      "id": 57,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 28",
      "des": "Codes défauts diesel et procédure de recherche de panne – X – Xbim – BIBI.",
      "type": "code_defauts",
      "systeme": "chaine_trac",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200128_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200128_A-.pdf"
    },
    {
      "id": 58,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 35",
      "des": "Logiciel « OLAM 2 » pour MD euro 2",
      "type": "logiciel",
      "systeme": "groupe_electro",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200135_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200135_A-.pdf"
    },
    {
      "id": 59,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 36",
      "des": "Logiciel « Man Cats II » pour MD Euro 3 et 3a",
      "type": "logiciel",
      "systeme": "groupe_electro",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200136_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200136_A-.pdf"
    },
    {
      "id": 60,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 37",
      "des": "Contrôle/commande MD Euro 2: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "groupe_electro",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200137_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200137_A-.pdf"
    },
    {
      "id": 61,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 38",
      "des": "Courbes de références DcuTerm - MD Euro 2",
      "systeme": "groupe_electro",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200138_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200138_A-.pdf"
    },
    {
      "id": 62,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 39",
      "des": "Contrôle/commande MD Euro 3 et 3A: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "groupe_electro",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200139_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200139_A-.pdf"
    },
    {
      "id": 63,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 40",
      "des": "Courbes de références DcuTerm - MD Euro 3 et 3 A",
      "systeme": "groupe_electro",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200140_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200140_A-.pdf"
    },
    {
      "id": 64,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 1 41",
      "des": "Procédure de vérification du circuit gasoil en cas de pollution - MD Euro 3 et 3 A",
      "systeme": "groupe_electro",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200141_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200141_A-.pdf"
    },
    {
      "id": 65,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 45",
      "des": "Logiciel « MONA »",
      "type": "logiciel",
      "systeme": "clim",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200145_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200145_A-.pdf"
    },
    {
      "id": 66,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 46",
      "des": "Climatisation voyageurs / Climatisation cabine: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "clim",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200146_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200146_A-.pdf"
    },
    {
      "id": 67,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 50",
      "des": "Logiciel « ST03 »",
      "type": "logiciel",
      "systeme": "frein_ae_prod_air",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200150_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200150_A-.pdf"
    },
    {
      "id": 68,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 52",
      "des": "Anti-enrayage - Freinage conjugé: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "frein_ae_prod_air",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200152_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200152_A-.pdf"
    },
    {
      "id": 69,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 53",
      "des": "Gestion production d’air: Fonctionnement",
      "systeme": "frein_ae_prod_air",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200153_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200153_A-.pdf"
    },
    {
      "id": 70,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 60",
      "des": "Logiciel « HARDI » - Comble lacune",
      "type": "logiciel",
      "systeme": "portes",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200160_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200160_A-.pdf"
    },
    {
      "id": 71,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 61",
      "des": "Logiciel « WinMonext / WinVisual » - Portes d’accès",
      "type": "logiciel",
      "systeme": "portes",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200161_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200161_A-.pdf"
    },
    {
      "id": 72,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 62",
      "des": "Comble lacune: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "portes",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200162_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200162_A-.pdf"
    },
    {
      "id": 73,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 63",
      "des": "Portes d’accès voyageurs: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "portes",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200163_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200163_A-.pdf"
    },
    {
      "id": 74,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 64",
      "des": "Portes d’intercirculation: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "portes",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200164_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200164_A-.pdf"
    },
    {
      "id": 75,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 70",
      "des": "Logiciel « DownLoad Software »",
      "type": "logiciel",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200170_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200170_A-.pdf"
    },
    {
      "id": 76,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 71",
      "des": "Logiciel « Utilitaire carnet de bord »",
      "type": "logiciel",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200171_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200171_A-.pdf"
    },
    {
      "id": 77,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 74",
      "des": "Chargement applicatif tiroirs SIE - Echange tiroir SIE",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200174_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200174_A-.pdf"
    },
    {
      "id": 78,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 75",
      "des": "Chargement bases SIV",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200175_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200175_A-.pdf"
    },
    {
      "id": 79,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 76",
      "des": "Système Informatique Embarqué: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200176_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200176_A-.pdf"
    },
    {
      "id": 80,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 77",
      "des": "Système d’Information Voyageurs: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200177_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200177_A-.pdf"
    },
    {
      "id": 81,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 78",
      "des": "Réseaux LON, MVB, WTB: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200178_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200178_A-.pdf"
    },
    {
      "id": 82,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 79",
      "des": "Mise en service liaison Bord/Sol",
      "systeme": "sie_siv",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200179_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200179_A-.pdf"
    },
    {
      "id": 83,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 85",
      "des": "Logiciel « JetStream »",
      "type": "logiciel",
      "systeme": "retro_visio",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200185_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200185_A-.pdf"
    },
    {
      "id": 84,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 87",
      "des": "Rétro vision: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "retro_visio",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200187_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200187_A-.pdf"
    },
    {
      "id": 85,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 88",
      "des": "Vidéo surveillance: Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "retro_visio",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200188_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200188_A-.pdf"
    },
    {
      "id": 86,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 95",
      "des": "Logiciel « Flash Loader » / Chargement applicatifs platine SEMCO",
      "type": "logiciel",
      "systeme": "retro_visio",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200195_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200195_A-.pdf"
    },
    {
      "id": 87,
      "engin": "AGC",
      "engin_type": ['XGC', 'BGC', 'ZGC'],
      "ref_main": "LD 5 200 1 96",
      "des": "Module WC : Fonctionnement – Génération des codes défaut",
      "type": "code_defauts",
      "systeme": "retro_visio",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200196_A-.pdf",
      "url_main_file": "assets/documents/LD/LD5200196_A-.pdf"
    }
  ]

  // Data for DocFctPage
  docFctData: ItemDataType[] = [
    {
      "id": 2,
      "engin": "AGC",
      "engin_type": ['BGC'],
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
      "id": 3,
      "engin": "AGC",
      "engin_type": ['BGC'],
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
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E01",
      "ref_aux": "05-3 709 835",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) jusqu’à la rame X76563",
      "type": "schemas",
      "systeme": "ATESS",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 835",
      "url_main_file": "assets/documents/LD/LD5200203E01_A-.pdf"
    },
    {
      "id": 5,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E02",
      "ref_aux": "05-3 709 836",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) à partir de la rame X76575",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 836",
      "url_main_file": "assets/documents/LD/LD5200203E02_A-.pdf"
    },
    {
      "id": 6,
      "engin": "TER 2N NG",
      "engin_type": ['2C'],
      "ref_main": "LD 5 200 2 04 E01",
      "ref_aux": "05-3 709 839",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) jusqu’à la rame X76561",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 839",
      "url_main_file": "assets/documents/LD/LD5200204E01_A-.pdf"
    },
    {
      "id": 7,
      "engin": "TER 2N NG",
      "engin_type": ['2C'],
      "ref_main": "LD 5 200 2 04 E02",
      "ref_aux": "05-3 709 840",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) à partir de la rame X76565",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 840",
      "url_main_file": "assets/documents/LD/LD5200204E02_A-.pdf"
    },
    {
      "id": 8,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 05 E01",
      "ref_aux": "05-3 712 347",
      "des": "Schémas de câblage Z27500 motrice 1 couplable (ZAC) rame Z27503",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200205E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 347",
      "url_main_file": "assets/documents/LD/LD4200205E01_A-.pdf"
    }
  ]

  // Data for ModulesFormationPage
  docModuleFormation: ItemDataType[] = [
    {
      "id": 2,
      "engin": "AGC",
      "engin_type": ['BGC'],
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
      "id": 3,
      "engin": "AGC",
      "engin_type": ['BGC'],
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
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E01",
      "ref_aux": "05-3 709 835",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) jusqu’à la rame X76563",
      "type": "schemas",
      "systeme": "ATESS",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 835",
      "url_main_file": "assets/documents/LD/LD5200203E01_A-.pdf"
    },
    {
      "id": 5,
      "engin": "AGC",
      "engin_type": ['XGC'],
      "ref_main": "LD 5 200 2 03 E02",
      "ref_aux": "05-3 709 836",
      "des": "Schémas de câblage X76500 motrice 1 couplable (XAC) à partir de la rame X76575",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200203E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 836",
      "url_main_file": "assets/documents/LD/LD5200203E02_A-.pdf"
    },
    {
      "id": 6,
      "engin": "TER 2N NG",
      "engin_type": ['2C'],
      "ref_main": "LD 5 200 2 04 E01",
      "ref_aux": "05-3 709 839",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) jusqu’à la rame X76561",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 839",
      "url_main_file": "assets/documents/LD/LD5200204E01_A-.pdf"
    },
    {
      "id": 7,
      "engin": "TER 2N NG",
      "engin_type": ['2C'],
      "ref_main": "LD 5 200 2 04 E02",
      "ref_aux": "05-3 709 840",
      "des": "Schémas de câblage X76500 motrice 1 standard (XAS) à partir de la rame X76565",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD5200204E02_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 709 840",
      "url_main_file": "assets/documents/LD/LD5200204E02_A-.pdf"
    },
    {
      "id": 8,
      "engin": "AGC",
      "engin_type": ['ZGC'],
      "ref_main": "LD 4 200 2 05 E01",
      "ref_aux": "05-3 712 347",
      "des": "Schémas de câblage Z27500 motrice 1 couplable (ZAC) rame Z27503",
      "type": "schemas",
      "systeme": "motrice",
      "url_main": "https://dsmat.sncf.fr/ZMediaHandler.ashx?mode=ms&document=documents/LD4200205E01_A-.pdf",
      "url_aux": "https://docmat.sncf.fr/#/search/05-3 712 347",
      "url_main_file": "assets/documents/LD/LD4200205E01_A-.pdf"
    }
  ]

  constructor() { }
}
