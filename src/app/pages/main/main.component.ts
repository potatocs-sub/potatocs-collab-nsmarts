import { Component } from '@angular/core';
import { MaterialsModule } from '../../materials/materials.module';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MaterialsModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {

}
