import { Injectable, inject } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AdminsService {

  private baseUrl = environment.apiUrl;

  private http = inject(HttpClient)
  constructor() { }
  // 회사 목록 가져오기
  getAdminList(active: string, direction: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/nsmarts/admins/', { params: { active, direction, pageIndex, pageSize } })
  }

  // 회사 추가
  addCompany(companyData: any) {
    return this.http.post(this.baseUrl + '/nsmarts/companies', companyData)
  }

  getCompanyById(companyId: any) {
    return this.http.get(this.baseUrl + '/nsmarts/companies/' + companyId)
  }

  editCompany(companyId: string, companyData: any) {
    return this.http.patch(this.baseUrl + '/nsmarts/companies/' + companyId, companyData)
  }

  deleteCompany(companyId: any) {
    return this.http.delete(this.baseUrl + '/nsmarts/companies/' + companyId)
  }
}
