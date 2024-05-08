import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  constructor() { }

  getCountryList(active: string, direction: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/nsmarts/countries', { params: { active, direction, pageIndex, pageSize } })
  }

  addCountry(countryData: any) {
    return this.http.post(this.baseUrl + '/nsmarts/countries', countryData)
  }

  deleteCountry(id: string) {
    return this.http.delete(this.baseUrl + '/nsmarts/countries/' + id)
  }

}
