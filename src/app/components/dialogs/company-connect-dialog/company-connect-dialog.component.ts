import { DialogService } from './../../../stores/dialog/dialog.service';
import { Component, ViewChild, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { CompaniesService } from '../../../services/companies/companies.service';
import { MaterialsModule } from '../../../materials/materials.module';
import { CommonModule } from '@angular/common';
import { AdminsService } from '../../../services/admins/admins.service';

@Component({
  selector: 'app-company-connect-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './company-connect-dialog.component.html',
  styleUrl: './company-connect-dialog.component.scss',
})
export class CompanyConnectDialogComponent {
  displayedColumns: string[] = [
    'code',
    'name',
    'rollover',
    'rollover_max_month',
    'rollover_max_day',
  ];
  companies = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  private companiesService = inject(CompaniesService);
  private dialogsService = inject(DialogService);
  private adminsService = inject(AdminsService);

  public dialogRef = inject(MatDialogRef<CompanyConnectDialogComponent>);
  public data = inject(MAT_DIALOG_DATA);

  pageSize = 5;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  ngAfterViewInit() {
    this.getCompanyList();
  }

  getCompanyList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.companiesService
            .queryCompanies(
              this.sort.active,
              this.sort.direction,
              this.paginator.pageIndex,
              this.paginator.pageSize
            )
            .pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          if (res === null) {
            this.isRateLimitReached = true;
            return [];
          }
          this.isRateLimitReached = false;
          this.resultsLength = res.totalCount;
          return res.foundCompanyList;
        })
      )
      .subscribe((data: any) => (this.companies.data = data));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.companies.filter = filterValue.trim().toLowerCase();
  }

  connectCompanyAdmin(id: any) {
    const company = {
      company_id: id,
      admin_id: this.data.admin_id,
    };
    this.dialogsService
      .openDialogConfirm(
        'Do you want to connect this company with the admin of your choice?'
      )
      .subscribe({
        next: (res) => {
          if (res) {
            this.adminsService.connectAdminCompany(company).subscribe({
              next: (data) => {
                this.dialogsService.openDialogPositive(
                  'Successfully connected company and admin.'
                );
                this.dialogRef.close();
              },
              error: (err) => {
                console.log(err);
                this.dialogsService.openDialogNegative(err.error.message);
              },
            });
          }
        },
      });
  }
}
