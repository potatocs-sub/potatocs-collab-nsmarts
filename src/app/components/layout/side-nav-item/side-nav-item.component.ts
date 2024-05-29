import { CommonModule } from '@angular/common';
import { Component, HostBinding, Input, inject } from '@angular/core';
import { MaterialsModule } from '../../../materials/materials.module';
import { RouterModule } from '@angular/router';
import { NavigationService } from '../../../stores/navigation/navigation.service';

@Component({
  selector: 'app-side-nav-item',
  standalone: true,
  imports: [CommonModule, MaterialsModule, RouterModule, SideNavItemComponent],
  templateUrl: './side-nav-item.component.html',
  styleUrl: './side-nav-item.component.scss',
})
export class SideNavItemComponent {
  @HostBinding('class')
  get levelClass() {
    return `item-level-${this.level}`;
  }

  @Input() item!: any;

  //레벨, 얼마나 깊이 들어왔는지 파악하기 위함
  @Input() level: number = 0;

  navigationService = inject(NavigationService);

  isLink = this.navigationService.isLink;
  isSubheading = this.navigationService.isSubheading;
}
