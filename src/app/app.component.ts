import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultLayoutComponent } from './components/core-components/default-layout/default-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  imports: [CommonModule, DefaultLayoutComponent],
})
export class AppComponent {
  title = 'personal-plug-site';
}
