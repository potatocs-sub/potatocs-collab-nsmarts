import { Component, HostListener, inject } from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DialogService } from "../../../stores/dialog/dialog.service";
import { CompaniesService } from "../../../services/companies/companies.service";
import { CommonModule } from "@angular/common";
import { MaterialsModule } from "../../../materials/materials.module";

@Component({
	selector: "app-companies-edit",
	standalone: true,
	imports: [CommonModule, MaterialsModule],
	templateUrl: "./companies-edit.component.html",
	styleUrl: "./companies-edit.component.scss",
})
export class CompaniesEditComponent {
	fb = inject(FormBuilder);
	route = inject(ActivatedRoute);
	router = inject(Router);
	dialogService = inject(DialogService);
	companiesService = inject(CompaniesService);

	editCompanyForm = this.fb.group({
		company_name: ["", [Validators.required]],
		leave_standard: this.fb.array([]),
		rollover: [false],
		rollover_max_month: [1, [Validators.required, Validators.min(1)]],
		rollover_max_day: [1, [Validators.required, Validators.min(1)]],
		isReplacementDay: [false],
		rd_validity_term: [1, [Validators.required, Validators.min(1)]],
		annual_policy: ["byContract"],
		isMinusAnnualLeave: [false],
	});

	leave_standard: FormArray = this.editCompanyForm.get("leave_standard") as FormArray;
	year: any;
	companyId: string;

	constructor() {
		this.companyId = this.route.snapshot.paramMap.get("id")!;
	}

	ngAfterViewInit() {
		this.companiesService.getCompanyById(this.companyId).subscribe({
			next: (res: any) => {
				// Patch the rest of the form
				this.editCompanyForm.patchValue(res.data);

				this.editCompanyForm.value.rollover
					? ""
					: this.editCompanyForm.get("rollover_max_month")?.setValue(1) ||
					  this.editCompanyForm.get("rollover_max_day")?.setValue(1);
				this.editCompanyForm.value.isReplacementDay
					? ""
					: this.editCompanyForm.get("rd_validity_term")?.setValue(1);

				this.patchLeaveStadard(res.data);
			},
			error: (error: any) => {
				this.dialogService.openDialogNegative(error.message);
			},
		});
	}

	//Cancel 버튼 클릭
	toBack(): void {
		this.router.navigate(["companies"]);
	}

	addItem() {
		const newLeaveStandard = this.createLeaveStandard();
		this.leave_standard.push(newLeaveStandard);
		this.updateYears();
	}

	createLeaveStandard(): FormGroup {
		return this.fb.group({
			year: 0,
			annual_leave: [0, [Validators.required, Validators.min(0)]],
			sick_leave: [0, [Validators.required, Validators.min(0)]],
			replacement_leave: 0,
			rollover: 0,
		});
	}

	updateYears() {
		this.leave_standard.controls.forEach((group, index) => {
			group.get("year")?.setValue(index + 1);
		});
	}

	//Leave Standard에 - 버튼 클릭
	cancelItem(index: number) {
		if (this.leave_standard) {
			this.leave_standard.removeAt(index);
			this.updateYears();
		}
	}

	getLeaveStandardsControls(): any {
		return this.leave_standard;
	}

	patchLeaveStadard(data: any) {
		// 기존 컨트롤 제거
		this.leave_standard.clear();
		// 새로운 컨트롤 추가
		for (let i = 0; i < data.leaveStandardsLength; i++) {
			this.leave_standard.push(this.getLeaveStandard(data.leave_standard[i]));
		}
	}

	/**
	 * 기존 연차정책을 가져와, formgroup객체 형식으로 만든 후 FormArray에 담는다.
	 * @returns
	 */
	getLeaveStandard(data: any): FormGroup {
		return this.fb.group({
			year: data.year,
			annual_leave: [data.annual_leave, [Validators.required, Validators.min(0)]],
			sick_leave: [data.sick_leave, [Validators.required, Validators.min(0)]],
			replacement_leave: [data.replacement_leave],
			rollover: [data.rollover],
		});
	}

	editCompany(): void {
		if (this.editCompanyForm.valid) {
			const companyData = this.prepareCompanyData();
			this.companiesService.editCompany(this.companyId, companyData).subscribe({
				next: () => {
					this.router.navigate(["companies"]);
					this.dialogService.openDialogPositive("Successfully edited company.");
				},
				error: (err: any) => {
					console.log(err);
					this.dialogService.openDialogNegative(err.error.message);
				},
			});
		}
	}

	private prepareCompanyData(): any {
		const formValue = this.editCompanyForm.value;
		const leaveStandards = formValue.leave_standard ? formValue.leave_standard : [];
		const lastLeaveStandard = leaveStandards.slice(-1)[0] || {
			annualLeave: 0,
			sickLeave: 0,
			replacement_leave: 0,
			rollover: 0,
		};
		return {
			...formValue,
			rolloverMaxMonth: formValue.rollover ? formValue.rollover_max_month : 0,
			rolloverMaxLeaveDays: formValue.rollover ? formValue.rollover_max_day : 0,
			rdValidityTerm: formValue.isReplacementDay ? formValue.rd_validity_term : 0,
			leave_standard: this.generateFutureLeaveStandards(leaveStandards, lastLeaveStandard),
			leaveStandardsLength: leaveStandards.length,
		};
	}

	private generateFutureLeaveStandards(leaveStandards: any[], lastLeaveStandard: any): any[] {
		return leaveStandards.concat(
			Array(50)
				.fill(null)
				.map((_, index) => ({
					year: leaveStandards.length + index + 1,
					annual_leave: lastLeaveStandard.annual_leave,
					sick_lLeave: lastLeaveStandard.sick_leave,
					replacement_leave: lastLeaveStandard.sick_leave,
					rollover: lastLeaveStandard.sick_leave,
				}))
		);
	}

	//input type="number" 한글 안써지도록
	@HostListener("input", ["$event"])
	onInput(event: Event): void {
		const inputElement = event.target as HTMLInputElement;
		const inputValue = inputElement.value;

		if (inputElement.classList.contains("numeric-input")) {
			const numericValue = inputValue.replace(/[^-\d]/g, "");
			inputElement.value = numericValue;
		}
	}
}
