import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button'
import { TooltipModule } from 'primeng/tooltip';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatLabelModule, FormsModule, ButtonModule, TooltipModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input()
  email: string = '';
  @Input()
  password: string = '';
}
