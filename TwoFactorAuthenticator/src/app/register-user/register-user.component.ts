import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationServiceService } from '../Service/authentication-service.service';
import { CommonModule } from '@angular/common';
import { UserForRegistrationDto } from '../Model/UserForRegistrationDto';

@Component({
  selector: 'app-register-user',
  imports: [CommonModule,ReactiveFormsModule,RouterLink],
  templateUrl: './register-user.component.html',
  styleUrls: ['./register-user.component.css']
})
export class RegisterUserComponent implements OnInit {

  registerForm: FormGroup = new FormGroup({
    firstName: new FormControl(''),
    lastName: new FormControl(''),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    confirm: new FormControl('')
  });
  
  constructor(
    private authService: AuthenticationServiceService,
    private router: Router
  ) { }

  ngOnInit(): void { }

  public validateControl = (controlName: string) => {
    return this.registerForm.get(controlName)?.invalid && this.registerForm.get(controlName)?.touched
  }

  public hasError = (controlName: string, errorName: string) => {
    return this.registerForm.get(controlName)?.hasError(errorName)
  }

  public registerUser = (registerFormValue:any) => {
    const formValues = { ...registerFormValue };
    const user: UserForRegistrationDto = {
      firstName: formValues.firstName,
      lastName: formValues.lastName,
      email: formValues.email,
      password: formValues.password,
      confirmPassword: formValues.confirm
    };
    this.authService.registerUser(user)
    .subscribe({
      next: (_) => {
        console.log("Successful registration");
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => console.log(err.error.errors)
    })
  }
}
