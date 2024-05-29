import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { MatPaginator } from '@angular/material/paginator';
import { CountriesService } from '../../../services/countries/countries.service';
import { MatSort } from '@angular/material/sort';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { MatDialog } from '@angular/material/dialog';
import { CountriesAddDialogComponent } from '../../../components/dialogs/countries-dialog/countries-add-dialog/countries-add-dialog.component';
import { HolidaysAddDialogComponent } from '../../../components/dialogs/holidays-dialog/holidays-add-dialog/holidays-add-dialog.component';

@Component({
  selector: 'app-countries-list',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './countries-list.component.html',
  styleUrl: './countries-list.component.scss',
})
export class CountriesListComponent {
  countriesService = inject(CountriesService);
  dialogService = inject(DialogService);
  dialog = inject(MatDialog);

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['countryName', 'countryCode', 'btns'];

  countryList: any = [];
  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  ngAfterViewInit() {
    this.getCountryList();
  }

  getCountryList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.countriesService
            .getCountryList(
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
      .subscribe((data: any) => (this.countryList = data));
  }

  openAddCountry() {
    const dialogRef = this.dialog.open(CountriesAddDialogComponent);
    return dialogRef.afterClosed().subscribe((result) => {
      this.getCountryList();
    });
  }

  addCountryHoliday(id: any, countryHoliday: any[]) {
    const dialogRef = this.dialog.open(HolidaysAddDialogComponent, {
      data: {
        countryId: id,
        countryHoliday: countryHoliday,
      },
    });
  }

  // 나라 삭제
  deleteCountryDialog(id: any) {
    this.dialogService
      .openDialogConfirm('Do you delete this country?')
      .subscribe({
        next: (res: any) => {
          if (res) this.deleteCountry(id);
        },
        error: (err) => {
          console.log(err);
          this.dialogService.openDialogNegative(err.error.message);
        },
      });
  }

  deleteCountry(id: any) {
    this.countriesService.deleteCountry(id).subscribe({
      next: (res: any) => {
        this.getCountryList();
        this.dialogService.openDialogPositive(res.message);
      },
      error: (error) => {},
    });
  }
}
