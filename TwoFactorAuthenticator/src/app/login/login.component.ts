import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationServiceService } from '../Service/authentication-service.service';
import { CommonModule } from '@angular/common';
import { UserForAuthenticationDto } from '../Model/UserForAuthenticationDto';
import { ResponseDto } from '../Model/ResponseDto';
@Component({
  selector: 'app-login',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private returnUrl: string = "";
    loginForm: FormGroup;
  errorMessage: string = '';
  showError: boolean = false;
  constructor(
    private authService: AuthenticationServiceService, 
    private router: Router, 
    private route: ActivatedRoute
  ) {
      this.loginForm = new FormGroup({
    email: new FormControl("", [Validators.required]),
    password: new FormControl("", [Validators.required])
  });
     }
  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }
  validateControl = (controlName: string) => {
    return this.loginForm.get(controlName)?.invalid && this.loginForm.get(controlName)?.touched
  }
  hasError = (controlName: string, errorName: string) => {
    return this.loginForm.get(controlName)?.hasError(errorName)
  }
  loginUser = (loginFormValue: any) => {
    this.showError = false;
    const login = {... loginFormValue };
    const userForAuth: UserForAuthenticationDto = {
      email: login.email,
      password: login.password
    }
    this.authService.loginUser(userForAuth)
    .subscribe({
      next: (res:ResponseDto) => {
        
 console.log('Login response received:', res);
               // Save login data
        const email = login.email;
         localStorage.setItem('email', email);
        // localStorage.setItem('token', res.token ?? '');
      console.log(' isTwoFactorEnabled:', localStorage.getItem('isTwoFactorEnabled'));
      console.log(' needs2FASetup:', localStorage.getItem('needs2FASetup'));     
        const isTfaEnabled = localStorage.getItem('isTwoFactorEnabled') === 'true';
        const needs2FASetup = localStorage.getItem('needs2FASetup') === 'true';
     // console.log('isTfaEnabled', isTfaEnabled);
     // console.log('needs2FASetup', needs2FASetup);
       if(isTfaEnabled){
        if (needs2FASetup) {
        this.router.navigate(['/tfa-setup'], {
              queryParams: { returnUrl: this.returnUrl, email}
            });
       }
       else {
            this.router.navigate(['/twostepverification'], {
              queryParams: { returnUrl: this.returnUrl, email }
            });
          }}
              else {
                localStorage.setItem('token', res.token ?? '');
        this.router.navigate([this.returnUrl]);
       }
    },
    error: (err: HttpErrorResponse) => {
      console.error('Login failed:', err);
      this.errorMessage = err.message;
      this.showError = true;
    }})
  }
}