import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild, inject } from '@angular/core';
import { MaterialsModule } from '../../../../materials/materials.module';
import { DialogService } from '../../../../stores/dialog/dialog.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HolidaysService } from '../../../../services/holidays/holidays.service';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { catchError, map, merge, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-holidays-add-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './holidays-add-dialog.component.html',
  styleUrl: './holidays-add-dialog.component.scss'
})
export class HolidaysAddDialogComponent {
  private fb = inject(FormBuilder)
  private dialogService = inject(DialogService)
  private holidaysService = inject(HolidaysService)
  public dialogRef = inject(MatDialogRef<HolidaysAddDialogComponent>)
  public data: any = inject(MAT_DIALOG_DATA)

  displayedColumns: string[] = ['holidayName', 'holidayDate', 'btns'];


  countryHolidayList: any = []
  pageSize = 10;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  countryHolidayForm: FormGroup = this.fb.group({
    holidayName: ['', [Validators.required]],
    holidayDate: ['', [Validators.required]],
  });


  constructor(
  ) { }
  ngAfterViewInit() {
    this.getCountryHolidayList();
  }

  getCountryHolidayList() {
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));
    console.log(this.data)
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          return this.holidaysService.getHolidayList(
            this.data.countryId,
            this.sort.active,
            this.sort.direction,
            this.paginator.pageIndex,
            this.paginator.pageSize,
          ).pipe(catchError(() => of(null)));
        }),
        map((res: any) => {
          // Flip flag to show that loading has finished.
          console.log(res)
          this.isLoadingResults = false;
          if (res === null) {
            this.isRateLimitReached = true;
            return [];
          }
          this.isRateLimitReached = false;
          this.resultsLength = res.data.countryHoliday.length;
          return res.data.countryHoliday;
        }),
      )
      .subscribe((data: any) => this.countryHolidayList = data);
  }

  addCountryHoliday() {
    const formData = {
      ...this.countryHolidayForm.value,
      _id: this.data.countryId,

    }
    this.holidaysService.addHoliday(formData).subscribe({
      next: (res: any) => {
        console.log(res)
        this.getCountryHolidayList()
      }
    })
  }

  deleteCountryHoliday(id: string) {

    this.holidaysService.deleteHoliday(id, this.data.countryId).subscribe({
      next: (res: any) => {
        console.log(res)
        this.getCountryHolidayList()
      }
    })
  }

  datePickChange(dateValue: any) {
    this.countryHolidayForm.get('holidayDate')?.setValue(dateValue);
  }
}
