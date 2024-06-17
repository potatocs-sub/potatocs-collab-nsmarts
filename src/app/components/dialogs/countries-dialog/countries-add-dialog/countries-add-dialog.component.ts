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
        this.dialogRef.close();
        this.dialogService.openDialogPositive('Successfully added country.');
      },
      error: (err: any) => {
        console.log(err);
        if (err.status === 404) {
          this.dialogService.openDialogNegative(
            'The country code is duplicated.'
          );
        } else {
          this.dialogService.openDialogNegative(err.error.message);
        }
      },
    });
  }
}
