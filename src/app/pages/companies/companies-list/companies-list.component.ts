import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { CompaniesService } from '../../../services/companies/companies.service';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-companies-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './companies-list.component.html',
  styleUrl: './companies-list.component.scss',
})
export class CompaniesListComponent {
  public dialogService = inject(DialogService);
  router = inject(Router);
  companiesService = inject(CompaniesService);

  displayedColumns: string[] = [
    'code',
    'name',
    'rollover',
    'rollover_max_month',
    'rollover_max_day',
    'btns',
  ];
  company_max_day: any = 0;

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRollover = false;
  dataSource = new MatTableDataSource();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor() {}

  ngAfterViewInit() {
    this.getCompanyList();
  }

  ngOnInit(): void {
    if (this.company_max_day != undefined) {
      this.isRollover = true;
      this.displayedColumns = [
        'code',
        'name',
        'rollover',
        'rollover_max_month',
        'rollover_max_day',
        'btns',
      ];
    }
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
          this.isLoadingResults = false;
          if (res === null) {
            return [];
          }
          this.resultsLength = res.totalCount;
          return res.foundCompanyList;
        })
      )
      .subscribe((data: any) => (this.dataSource = data));
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

  // 회사 삭제 dialog
  deleteCompanyDialog(id: any) {
    this.dialogService
      .openDialogConfirm('Do you want to delete this company?')
      .subscribe({
        next: (res: any) => {
          if (res) this.deleteCompany(id);
        },
        error: (err) => {
          console.log(err);
          this.dialogService.openDialogNegative(err.error.message);
        },
      });
  }

  // 회사 삭제
  deleteCompany(id: any) {
    this.companiesService.deleteCompany(id).subscribe((data: any) => {
      if (data.message == 'delete company') {
        this.dialogService.openDialogPositive('Successfully deleted company.');
        this.getCompanyList();
      }
    });
  }
}
