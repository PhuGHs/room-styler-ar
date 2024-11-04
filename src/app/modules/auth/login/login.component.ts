import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FloatLabelModule, FormsModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  @Input()
  email: string = '';
}
