import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

export interface NavButton {
  input: string,
  icon: string,
  selectedIcon: string,
  routerLink: string
}

@Component({
  selector: 'app-nav-button',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './nav-button.component.html',
  styleUrl: './nav-button.component.scss'
})
export class NavButtonComponent {
  @Input() prop!: NavButton;
}
