import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HolidaysService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient)
  constructor() { }

  getHolidayList(id: string, active: string, direction: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/nsmarts/holidays', { params: { id, active, direction, pageIndex, pageSize } })
  }

  addHoliday(holidayData: any) {
    return this.http.post(this.baseUrl + '/nsmarts/holidays', holidayData)
  }

  deleteHoliday(holidayId: string, countryId: string) {
    return this.http.delete(this.baseUrl + '/nsmarts/holidays/' + holidayId, { params: { 'countryId': countryId } })
  }
}
