import { CompanyConnectDialogComponent } from './../../components/dialogs/company-connect-dialog/company-connect-dialog.component';
import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminsService } from '../../services/admins/admins.service';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../../materials/materials.module';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-admins-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './admins-list.component.html',
  styleUrl: './admins-list.component.scss'
})
export class AdminsListComponent {

  displayedColumns: string[] = ['name', 'email', 'company', 'delete'];

  adminList = new MatTableDataSource;

  managerName = '';
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  isRollover = false;

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  data: any = []

  @ViewChild(MatSort) sort!: MatSort;

  adminsService = inject(AdminsService)
  dialog = inject(MatDialog)

  ngAfterViewInit() {

    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.adminsService.getAdminList(
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          if (res === null) {
            this.isRateLimitReached = true;
            return [];
          }
          this.isRateLimitReached = false;
          this.resultsLength = res.total_count;
          return res.data;
        }),
      )
      .subscribe((data: any) => (this.adminList = data));

  }


  connectCompany(id: string) {
    const dialogRef = this.dialog.open(CompanyConnectDialogComponent, {
      data: {
        admin_id: id
      }
    });
  }

  deleteAdmin(id: string) {

  }
}
