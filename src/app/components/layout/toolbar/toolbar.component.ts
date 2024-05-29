import { AuthService } from './../../../services/auth/auth.service';
import { Component, WritableSignal, effect, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { SideNavService } from '../../../stores/side-nav/side-nav.service';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MaterialsModule, CommonModule, RouterLink],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss',
})
export class ToolbarComponent {
  sideNavService = inject(SideNavService);
  authService = inject(AuthService);
  router = inject(Router);

  // 시그널 변수 선언
  isSideNavOpen: WritableSignal<boolean> = this.sideNavService.isSideNavOpen;
  isDesktop: WritableSignal<boolean> = this.sideNavService.isDesktop;
  userInfo: WritableSignal<any | null> = this.authService.userInfo;

  constructor() {
    effect(() => {
      console.log(this.userInfo());
    });
  }

  openSidenav() {
    this.isSideNavOpen.update(() => true);
  }

  logOut() {
    this.authService.logOut();
    this.router.navigate(['']);
  }
}
