import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CanvasBoxComponent } from '../../sub-components/canvas-box/canvas-box.component';
import { AppStore } from '../../../store/app.stroe';
@Component({
  selector: 'app-user-landing',
  standalone: true,
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.scss',
  imports: [CommonModule, CanvasBoxComponent],
})
export class UserLandingComponent implements OnInit {
  store = inject(AppStore);
  testString$ = this.getTestString();

  public glbPath: string = '../../../../assets/Box_Bounce_01.glb';

  ngOnInit(): void {
    this.getTestString();
  }

  getTestString() {
    return this.store.getTestString();
  }
}
