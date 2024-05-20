import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MaterialsModule } from '../../../../materials/materials.module';
import { MatDialogRef } from '@angular/material/dialog';
import { DialogService } from '../../../../stores/dialog/dialog.service';
import { CountriesService } from '../../../../services/countries/countries.service';

@Component({
  selector: 'app-countries-add-dialog',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './countries-add-dialog.component.html',
  styleUrl: './countries-add-dialog.component.scss',
})
export class CountriesAddDialogComponent {
  private fb = inject(FormBuilder);
  private dialogService = inject(DialogService);
  private countriesService = inject(CountriesService);
  public dialogRef = inject(MatDialogRef<CountriesAddDialogComponent>);

  displayedColumns: string[] = ['countryName', 'countryCode'];
  // form group
  countryForm: FormGroup = this.fb.group({
    countryName: ['', [Validators.required]],
    countryCode: ['', [Validators.required]],
  });

  constructor() {}

  addCountry() {
    const formValue = this.countryForm.value;

    const countryData = {
      countryName: formValue.countryName,
      countryCode: formValue.countryCode,
    };

    this.countriesService.addCountry(countryData).subscribe({
      next: (res: any) => {
        if (res.message == 'Success add country') {
          this.dialogRef.close();
          this.dialogService.openDialogPositive('Success add country.');
        }
      },
      error: (err: any) => {
        if (err.error.message == 'The country code is duplicated.') {
          //   this.dialogRef.close();
          this.dialogService.openDialogNegative(
            'The country code is duplicated.'
          );
        } else if (err.error.message == 'adding Country Error') {
          this.dialogRef.close();
          this.dialogService.openDialogNegative('An error has occured.');
        }
      },
    });
  }
}
