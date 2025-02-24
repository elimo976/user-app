import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 loginForm = new FormGroup({
   email: new FormControl('',[Validators.required, Validators.email]),
   password: new FormControl('',[Validators.required, Validators.minLength(3)])
 })

 constructor(private authService: AuthService) {}

 onSubmit(): void {
  const { email, password } = this.loginForm.value;
  if (email && password) {
    this.authService.login(email, password).subscribe({
      error: () => alert('Credenziali errate!')
    });
  }
 }
}
