import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationServiceService } from '../Service/authentication-service.service';
import { CommonModule } from '@angular/common';
import { TfaDto } from '../Model/TfaDto';
import { ResponseDto } from '../Model/ResponseDto';

@Component({
  selector: 'app-two-step-vertification',
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './two-step-vertification.component.html',
  styleUrl: './two-step-vertification.component.css'
})
export class TwoStepVertificationComponent implements OnInit {
  private email: string = "";
  private returnUrl: string = "";

  twoStepForm = new FormGroup({
    twoFactorCode: new FormControl('', [Validators.required]),
  });
  showError: boolean = false;
  errorMessage: string = "";

  constructor(private authService: AuthenticationServiceService,
    private route: ActivatedRoute, 
    private router: Router) { }

  ngOnInit(): void {
      this.email = this.route.snapshot.queryParams['email'];
      this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
     // this.email = this.route.snapshot.queryParams['email'];
  }

  validateControl = (controlName: string) => {
    return this.twoStepForm.get(controlName)?.invalid && this.twoStepForm.get(controlName)?.touched
  }
  hasError = (controlName: string, errorName: string) => {
    return this.twoStepForm.get(controlName)?.hasError(errorName)
  }

  loginUser = (twoStepFromValue: any) => {
    this.showError = false;
    
    const formValue = { ...twoStepFromValue };
    let twoFactorDto: TfaDto = {
      email: this.email,
      code: formValue.twoFactorCode
    }
    this.authService.loginUserTfa(twoFactorDto)
    .subscribe({
      next: (res:ResponseDto) => {
        localStorage.setItem("token", res.token);
        localStorage.setItem("email", this.email);
         localStorage.setItem("is2faVerified", "true");
        this.router.navigate([this.returnUrl]);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage = err.message;
        this.showError = true;
      }
    })
  }  
}
