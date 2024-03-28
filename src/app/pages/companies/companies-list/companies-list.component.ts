import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../services/companies/companies.service';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss'
})
export class CompaniesListComponent {
  public dialogService = inject(DialogService)
  router = inject(Router)
  companiesService = inject(CompaniesService)


  displayedColumns: string[] = ['code', 'name', 'rollover', 'rollover_max_month', 'rollover_max_day', 'btns'];
  filterValues = {};
  filterSelectObj: any = [];
  company_max_day: any = 0;

  dataSource = new MatTableDataSource;

  myRank = window.location.pathname.split('/')[3];
  managerName = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  isRollover = false;
  constructor(

  ) { }

  ngAfterViewInit() {
    // if (this.company_max_day != undefined) {
    //   this.isRollover = true;
    //   this.displayedColumns = ['code', 'name', 'rollover', 'rollover_max_month', 'rollover_max_day', 'btns'];
    // }
    this.getCompanyList();
  }

  ngOnInit(): void {
    // this.dataService.userCompanyProfile.pipe(takeUntil(this.unsubscribe$)).subscribe(
    // 	(data: any) => {
    // 		this.company_max_day = data.rollover_max_day
    // 		if(this.company_max_day != undefined){
    // 			this.isRollover = true;
    // 			this.displayedColumns = ['code', 'name', 'rollover', 'rollover_max_month', 'rollover_max_day', 'btns'];
    // 		}
    // 		this.getMyEmployeeLists();
    // })
    if (this.company_max_day != undefined) {
      this.isRollover = true;
      this.displayedColumns = ['code', 'name', 'rollover', 'rollover_max_month', 'rollover_max_day', 'btns'];
    }
  }

  getCompanyList() {
    this.companiesService.getCompanyList().subscribe({
      next: (res: any) => {
        console.log(res)
        this.dataSource = res.getCompany;
        this.dataSource = new MatTableDataSource<any>(res.getCompany);
        this.dataSource.paginator = this.paginator;
      },
      error: (error: any) => {
        console.log(error)
      }
    })
  }

  backManagerList() {
    this.router.navigate(['employee-mngmt/manager-list']);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }



  // 회사 추가
  addCompany() {
    this.router.navigate(['companies/add']);
  }

  // 회사 수정
  editCompany(id: any) {
    this.router.navigate(['companies/edit/' + id]);
  }

  // 회사 삭제
  deleteCompanyDialog(id: any) {
    this.dialogService.openDialogConfirm('Do you delete this company?').subscribe({
      next: (res: any) => {
        if (res) this.deleteCompany(id)
      },
      error: (err) => {
        console.log(err);
        this.dialogService.openDialogNegative(err.error.message);
      }
    })
  }

  deleteCompany(id: any) {
    // 회사 삭제
    this.companiesService.deleteCompany(id).subscribe((data: any) => {
      if (data.message == 'delete company') {
        this.dialogService.openDialogPositive('Successfully, the company has been delete.');
        this.getCompanyList();
      }
    })
  }
}
