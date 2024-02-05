import { Component, OnInit, inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { CommonModule } from '@angular/common';
import { appFeature } from '../../../store/app.reducers';
import { appActions } from '../../../store/app.actions';
import { CanvasBoxComponent } from '../../sub-components/canvas-box/canvas-box.component';
@Component({
  selector: 'app-user-landing',
  standalone: true,
  templateUrl: './user-landing.component.html',
  styleUrl: './user-landing.component.scss',
  imports: [CommonModule, CanvasBoxComponent],
})
export class UserLandingComponent implements OnInit {
  store = inject(Store);
  testString$ = this.store.select(appFeature.selectTestString);

  public glbPath: string = '../../../../assets/Box_Bounce_01.glb';

  ngOnInit(): void {
    this.store.dispatch(appActions.getTestString());
  }
}
