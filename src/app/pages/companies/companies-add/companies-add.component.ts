import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DialogService } from '../../../stores/dialog/dialog.service';
import { CompaniesService } from '../../../services/companies/companies.service';

@Component({
  selector: 'app-company-add',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './companies-add.component.html',
  styleUrl: './companies-add.component.scss',
})
export class CompaniesAddComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  dialogService = inject(DialogService);
  companiesService = inject(CompaniesService);

  addCompanyForm = this.fb.group({
    company_name: ['', [Validators.required]],
    leave_standard: this.fb.array([]),
    rollover: [false],
    rollover_max_month: [1, [Validators.min(1)]],
    rollover_max_day: [1, [Validators.min(1)]],
    isReplacementDay: [false],
    rd_validity_term: [1, [Validators.min(1)]],
    annual_policy: ['byContract'],
    isMinusAnnualLeave: [false],
  });

  leave_standard: FormArray = this.addCompanyForm.get(
    'leave_standard'
  ) as FormArray;
  year: any;

  constructor() {
    this.addItem();
  }

  //Cancel 버튼 클릭
  toBack(): void {
    this.router.navigate(['companies']);
  }

  addItem() {
    const newLeaveStandard = this.createLeaveStandard();
    this.leave_standard.push(newLeaveStandard);
    this.updateYears();
  }

  createLeaveStandard(): FormGroup {
    return this.fb.group({
      year: 0,
      annual_leave: [0, [Validators.min(0)]],
      sick_leave: [0, [Validators.min(0)]],
    });
  }

  updateYears() {
    this.leave_standard.controls.forEach((group, index) => {
      group.get('year')?.setValue(index + 1);
    });
  }

  //Leave Standard에 - 버튼 클릭
  cancelItem(index: number) {
    if (this.leave_standard.length > index) {
      this.leave_standard.removeAt(index);
      this.updateYears();
    }
  }

  getLeaveStandardsControls(): any {
    return this.leave_standard;
  }

  addCompany(): void {
    if (this.addCompanyForm.valid) {
      const companyData = this.prepareCompanyData();

      this.companiesService.addCompany(companyData).subscribe({
        next: () => {
          this.router.navigate(['companies']);
          this.dialogService.openDialogPositive('Successfully added company.');
        },
        error: (err) => {
          console.error(err);
          const errorMessage =
            err.status === 409
              ? 'The company name is duplicated.'
              : 'An error has occured.';
          this.dialogService.openDialogNegative(errorMessage);
        },
      });
    }
  }

  private prepareCompanyData(): any {
    const formValue = this.addCompanyForm.value;
    const leaveStandards = formValue.leave_standard
      ? formValue.leave_standard
      : [];
    const lastLeaveStandard = leaveStandards.slice(-1)[0] || {
      annual_leave: 0,
      sick_leave: 0,
    };
    return {
      ...formValue,
      rolloverMaxMonth: formValue.rollover ? formValue.rollover_max_month : 0,
      rolloverMaxLeaveDays: formValue.rollover ? formValue.rollover_max_day : 0,
      rdValidityTerm: formValue.isReplacementDay
        ? formValue.rd_validity_term
        : 0,
      leave_standard: this.generateFutureLeaveStandards(
        leaveStandards,
        lastLeaveStandard
      ),
      leaveStandardsLength: leaveStandards.length,
    };
  }

  private generateFutureLeaveStandards(
    leaveStandards: any[],
    lastLeaveStandard: any
  ): any[] {
    return leaveStandards.concat(
      Array(50)
        .fill(null)
        .map((_, index) => ({
          year: leaveStandards.length + index + 1,
          annual_leave: lastLeaveStandard.annual_leave,
          sick_leave: lastLeaveStandard.sick_leave,
        }))
    );
  }

  //input type="number" 한글 안써지도록
  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const inputValue = inputElement.value;

    if (inputElement.classList.contains('numeric-input')) {
      const numericValue = inputValue.replace(/[^-\d]/g, '');
      inputElement.value = numericValue;
    }
  }
}
