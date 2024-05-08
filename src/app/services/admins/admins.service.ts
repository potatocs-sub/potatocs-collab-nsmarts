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
  // 관리자 목록
  getAdminList(active: string, direction: string, pageIndex: number, pageSize: number) {
    return this.http.get(this.baseUrl + '/nsmarts/admins/', { params: { active, direction, pageIndex, pageSize } })
  }

  // admin이랑 company 매칭해주기
  connectAdminCompany(data: any) {
    // console.log(data);
    return this.http.patch(this.baseUrl + '/nsmarts/admins/connectAdminCompany', data)
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
