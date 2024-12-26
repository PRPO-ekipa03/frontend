import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthComponent } from '../auth.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {}
