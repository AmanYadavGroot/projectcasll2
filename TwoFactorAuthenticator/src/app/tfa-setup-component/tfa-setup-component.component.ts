import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthenticationServiceService } from '../Service/authentication-service.service';
import { CommonModule } from '@angular/common';
import { TfaSetupDto } from '../Model/TfaSetupDto';
import { QrCodeComponent } from 'ng-qrcode';
import {  Router } from '@angular/router';

@Component({
  selector: 'app-tfa-setup-component',
  imports: [CommonModule, ReactiveFormsModule,QrCodeComponent],
  templateUrl: './tfa-setup-component.component.html',
  styleUrls: ['./tfa-setup-component.component.css']
})
export class TfaSetupComponentComponent implements OnInit {
  tfaForm: FormGroup  = new FormGroup({
    code: new FormControl("", [Validators.required])
  });
  isLoading: boolean = true;
  tfaEnabled: boolean = false;
  showError: boolean = false;
  errorMessage: string = "";
  qrInfo: string = "";
  authenticatorKey: string = "";
  constructor(public authService: AuthenticationServiceService, private router: Router) { }
  ngOnInit(): void {
    let email = localStorage.getItem("email") ?? '';
    this.authService.getTfaSetup(email)
      .subscribe({next:(response:TfaSetupDto) => {
        this.tfaEnabled = response.isTfaEnabled ?? false;
        this.qrInfo = response.formattedKey ?? '';
        this.authenticatorKey = response.authenticatorKey ?? '';
        this.isLoading = false;
      },
      error: () => {
        this.showError = true;
        this.errorMessage = "Failed to load 2FA setup info.";
      }
    }
    );
  }

  validateControl = (controlName: string) => {
    return this.tfaForm.get(controlName)?.invalid && this.tfaForm.get(controlName)?.touched
  }
  hasError = (controlName: string, errorName: string) => {
    return this.tfaForm.get(controlName)?.hasError(errorName)
  }
  // disableTfa = () => {
  //   let email = localStorage.getItem("email") ?? '';
  //   this.authService.disableTfa(email)

  //   .subscribe({
  //     next: (res:any) => {
  //       this.tfaEnabled = false;
  //       this.router.navigate(['/home']);
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.showError = true;
  //       this.errorMessage = "Two-factor authentication was not disabled for this account (Message: " + err.message + ")";
  //     }})
  // }

  // enableTfa = (tfaFormValue: any) => {
  //   const tfaForm = {... tfaFormValue };

  //   const tfaSetupDto: TfaSetupDto = {
  //     email: localStorage.getItem("email") ?? '',
  //     code: tfaForm.code
  //   }

  //   this.authService.enableTfa(tfaSetupDto)
  //   .subscribe({
  //     next: (res:any) => {
  //       this.tfaEnabled = true;
  //                 // Redirect after 2FA is successfully enabled
  //         localStorage.setItem('isTwoFactorEnabled', 'true'); // Save the 2FA status in localStorage
  //         this.router.navigate(['/home']); // Redirect to home or another page

  //     //    // ✅ Perform logout
  //     //     this.authService.logout(); // custom method in your service
  //     //     localStorage.clear(); // just in case

  //     //     // ✅ Redirect to login
  //     //     this.router.navigate(['/login']);
  //     //  // this.router.navigate(['/']);
  //     },
  //     error: (err: HttpErrorResponse) => {
  //       this.showError = true;
  //       this.errorMessage = "Two-factor authentication was not activated for this account (Message: " + err.message + ")";
  //     }})
  enableTfa = (tfaFormValue: any) => {
    const tfaForm = { ...tfaFormValue };
    const tfaSetupDto: TfaSetupDto = {
      email: localStorage.getItem("email") ?? '',
      code: tfaForm.code
    }
    this.authService.enableTfa(tfaSetupDto).subscribe({
      next: () => {
        this.tfaEnabled = true;
        localStorage.setItem('isTwoFactorEnabled', 'true');
        localStorage.removeItem('needs2FASetup');        
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = "Two-factor authentication failed (Message: " + err.message + ")";
      }
    });
  }
  disableTfa = () => {
    const email = localStorage.getItem("email") ?? '';
    this.authService.disableTfa(email).subscribe({
      next: () => {
        this.tfaEnabled = false;
        localStorage.setItem('isTwoFactorEnabled', 'false');
        localStorage.removeItem('needs2FASetup');
        this.router.navigate(['/home']);
      },
      error: (err: HttpErrorResponse) => {
        this.showError = true;
        this.errorMessage = "Failed to disable 2FA (Message: " + err.message + ")";
      }
    });
  
  }  
}
