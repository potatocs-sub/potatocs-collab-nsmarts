import { Component, WritableSignal, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { SideNavService } from '../../../stores/side-nav/side-nav.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [MaterialsModule, CommonModule],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent {
  notiItems = [
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received',
    },
    {
      notiType: 'company-request',
      isRead: false,
      iconText: 'work_outline',
      notiLabel: 'A new company request received',
    },
    {
      notiType: 'company-res-y',
      isRead: false,
      iconText: 'done_outline',
      notiLabel: 'The company request has been accepted',
    },
    {
      notiType: 'leave-res-n',
      isRead: false,
      iconText: 'block',
      notiLabel: 'The leave request has been rejected',
    },
    {
      notiType: 'company-res-n',
      isRead: false,
      iconText: 'block',
      notiLabel: 'The company request has been rejected',
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received',
    },
    {
      notiType: 'leave-res-y',
      isRead: false,
      iconText: 'done_outline',
      notiLabel: 'A new leave request has been accepted',
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received',
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received',
    },
    {
      notiType: 'leave-request',
      isRead: false,
      iconText: 'open_in_browser',
      notiLabel: 'A new leave request received',
    },
  ];

  sideNavService = inject(SideNavService)


  // 시그널 변수 선언
  isSideNavOpen: WritableSignal<boolean> = this.sideNavService.isSideNavOpen;
  isDesktop: WritableSignal<boolean> = this.sideNavService.isDesktop;

  constructor(

  ) { }



  openSidenav() {
    this.isSideNavOpen.update(() => true);
  }
}
