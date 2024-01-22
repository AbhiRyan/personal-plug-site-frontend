import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MainNavbarComponent } from '../main-navbar/main-navbar.component';

@Component({
  selector: 'app-default-layout',
  standalone: true,
  templateUrl: './default-layout.component.html',
  styleUrl: './default-layout.component.scss',
  imports: [RouterOutlet, MainNavbarComponent],
})
export class DefaultLayoutComponent {}
