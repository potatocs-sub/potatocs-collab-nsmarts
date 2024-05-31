import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { MaterialsModule } from '../../materials/materials.module';
import { AuthService } from '../../services/auth/auth.service';
import { DialogService } from '../../stores/dialog/dialog.service';
import { Router } from '@angular/router';
import { ProfileService } from '../../services/profile/profile.service';

export const comparePasswordValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control.get('password');
  const confirmPassword = control.get('confirmPassword');

  return password && confirmPassword && password.value !== confirmPassword.value
    ? { isNotMatched: true }
    : null;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, MaterialsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  authService = inject(AuthService);
  userInfoStore = this.authService.userInfo;
  editProfileForm: FormGroup;
  dialogService = inject(DialogService);
  profileService = inject(ProfileService);

  constructor(private router: Router, private fb: FormBuilder) {
    this.editProfileForm = this.fb.group(
      {
        name: new FormControl('', [Validators.required]),
        password: new FormControl(''),
        confirmPassword: new FormControl(''),
      },
      { validators: comparePasswordValidator }
    );
  }

  ngOnInit() {
    this.editProfileForm.patchValue(this.userInfoStore());
  }

  fileChangeEvent(event: any) {
    if (event.target.files && event.target.files[0]) {
      if (
        event.target.files[0].name.toLowerCase().endsWith('.jpg') ||
        event.target.files[0].name.toLowerCase().endsWith('.png')
      ) {
        this.changeProfileImage(event.target.files[0]);
      } else {
        this.dialogService.openDialogNegative(
          'Profile photos are only available for PNG and JPG.'
        );
      }
    } else {
      this.dialogService.openDialogNegative('Can not bring up pictures.');
    }
  }

  changeProfileImage(imgFile: File) {
    this.profileService
      .changeProfileImg(imgFile, this.userInfoStore()._id)
      .subscribe({
        next: (res) => {
          this.refreshProfie();
        },
        error: (error) => {
          console.log(error);
          if (error.status === 413) {
            this.router.navigate(['profile']);
            this.dialogService.openDialogNegative(
              'The file size is too large. Must be less than 15M.'
            );
          } else {
            this.dialogService.openDialogNegative('An error has occured.');
          }
        },
      });
  }

  updateProfile() {
    if (this.editProfileForm.valid) {
      if (!this.editProfileForm.errors?.['isNotMatched']) {
        const patchData = {
          ...this.editProfileForm.value,
          _id: this.userInfoStore()._id,
        };

        // updateForm 중 값이 ''이면 객체에서 삭제. patch 시 변경될 값만 설정
        for (const key in patchData) {
          if (patchData.hasOwnProperty(key) && patchData[key] === '') {
            delete patchData[key];
          }
        }

        this.profileService.updateProfile(patchData).subscribe({
          next: (res) => {
            this.refreshProfie();
            this.dialogService.openDialogPositive(
              'Successfully updated profile.'
            );
            this.resetPwdInit();
          },
          error: (error) => {
            console.log(error);
            this.resetPwdInit();
          },
        });
      }
    }
  }

  refreshProfie() {
    const data = {
      email: this.userInfoStore().email,
    };
    this.authService.refreshToken(data).subscribe();
  }

  resetPwdInit() {
    this.editProfileForm.reset({
      name: this.editProfileForm.value.name,
      password: null,
      confirmPassword: null,
    });
  }
}
