import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class VersionParamsService {

  app_version: string = "V 2.1.0";
  app_build: string = "dev";
  date_maj_applicatif: string = "04/11/2023";
  date_maj_data_AGC: string = "04/11/2023";
  date_maj_data_TER2NNG: string = "04/11/2023";

}
