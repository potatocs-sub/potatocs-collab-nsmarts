import { CompanyConnectDialogComponent } from './../../components/dialogs/company-connect-dialog/company-connect-dialog.component';
import { Component, ViewChild, inject } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { AdminsService } from '../../services/admins/admins.service';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MaterialsModule } from '../../materials/materials.module';
import { MatDialog } from '@angular/material/dialog';
import { DialogService } from '../../stores/dialog/dialog.service';

@Component({
  selector: 'app-admins-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './admins-list.component.html',
  styleUrl: './admins-list.component.scss',
})
export class AdminsListComponent {
  displayedColumns: string[] = ['name', 'email', 'company', 'disconnect'];

  adminList = new MatTableDataSource();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  data: any = [];

  adminsService = inject(AdminsService);
  dialog = inject(MatDialog);
  dialogService = inject(DialogService);

  ngAfterViewInit() {
    this.getAdminList();
  }

  connectCompany(id: string) {
    const dialogRef = this.dialog.open(CompanyConnectDialogComponent, {
      data: {
        admin_id: id,
      },
    });
    return dialogRef.afterClosed().subscribe((result) => {
      this.getAdminList();
    });
  }

  getAdminList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.adminsService
            .getAdminList(
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
          this.resultsLength = res.total_count;
          return res.data;
        })
      )
      .subscribe((data: any) => (this.adminList.data = data));
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.adminList.filter = filterValue.trim().toLowerCase();
  }

  disconnectAdminCompanyDialog(id: any) {
    this.dialogService
      .openDialogConfirm('Do you want to disconnect this company and admin?')
      .subscribe({
        next: (res: any) => {
          if (res) this.disconnectAdminCompany(id);
        },
        error: (err) => {
          console.log(err);
          this.dialogService.openDialogNegative(err.error.message);
        },
      });
  }

  //admin 이랑 company 연결 끊기
  disconnectAdminCompany(data: any) {
    const admin = {
      admin_id: data,
    };
    this.adminsService.disconnectAdminCompany(admin).subscribe(
      (data: any) => {
        this.dialogService.openDialogPositive(
          'Successfully disconnected company and admin.'
        );
        this.getAdminList();
      },
      (err: any) => {
        console.log(err);
      }
    );
  }
}
