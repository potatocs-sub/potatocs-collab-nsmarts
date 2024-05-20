import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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

  days: any;
  start_date_sec: any;
  end_date_sec: any;
  millisecondsPerDay: any;
  diff: any;
  weeks: any;
  leaveDays: any;

  addCompanyForm = this.fb.group({
    company_name: ['', [Validators.required]],
    leave_standard: this.fb.array([
      this.fb.group({
        year: [0],
        annual_leave: [0, [Validators.min(0)]],
        sick_leave: [0, [Validators.min(0)]],
      }),
    ]),
    rollover: [false],
    rollover_max_month: [''],
    rollover_max_day: [''],
    country_code: [''],
    location: [''],
    isReplacementDay: [false],
    rd_validity_term: [''],
    annual_policy: ['byContract'],
    isMinusAnnualLeave: [false],
  });

  leaveStandards: FormArray = this.addCompanyForm.get(
    'leave_standard'
  ) as FormArray;
  year: any;

  constructor() {}

  //Cancel 버튼 클릭
  toBack(): void {
    this.router.navigate(['companies']);
  }

  addItem() {
    const newLeaveStandard = this.createLeaveStandard();
    this.leaveStandards.push(newLeaveStandard);
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
    this.leaveStandards.controls.forEach((group, index) => {
      group.get('year')?.setValue(index + 1);
    });
  }

  //Leave Standard에 - 버튼 클릭
  cancelItem(index: number) {
    if (this.leaveStandards.length > index) {
      this.leaveStandards.removeAt(index);
      this.updateYears();
    }
  }

  getLeaveStandardsControls(): any {
    return this.leaveStandards;
  }

  addCompany(): void {
    if (this.addCompanyForm.valid) {
      const companyData = this.prepareCompanyData();

      this.companiesService.addCompany(companyData).subscribe({
        next: () => {
          this.router.navigate(['companies']);
          this.dialogService.openDialogPositive(
            'Successfully, the company has been added.'
          );
        },
        error: (err) => {
          console.error(err);
          const errorMessage =
            err.status === 409
              ? 'Company name is duplicated.'
              : 'An error occurred while adding company.';
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
}
