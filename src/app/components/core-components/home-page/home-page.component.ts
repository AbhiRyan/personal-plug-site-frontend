import { Component } from '@angular/core';
import { CanvasBoxComponent } from '../../sub-components/canvas-box/canvas-box.component';

@Component({
  selector: 'app-home-page',
  standalone: true,
  templateUrl: './home-page.component.html',
  styleUrl: './home-page.component.scss',
  imports: [CanvasBoxComponent],
})
export class HomePageComponent {}
