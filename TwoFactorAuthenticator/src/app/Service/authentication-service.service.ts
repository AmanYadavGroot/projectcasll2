import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegistrationResponseDto } from '../Model/RegistrationResponseDto';
import { TfaSetupDto } from '../Model/TfaSetupDto';
import { UserForAuthenticationDto } from '../Model/UserForAuthenticationDto';
import { TfaDto } from '../Model/TfaDto';
import { UserForRegistrationDto } from '../Model/UserForRegistrationDto';
import { ResponseDto } from '../Model/ResponseDto';
import { environment } from '../environment/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceService {

  
constructor(private http: HttpClient) { }
 logout(): void 
 {
    localStorage.removeItem('token');
    localStorage.removeItem('email');
 }
  public registerUser = (body: UserForRegistrationDto) => {
    return this.http.post<RegistrationResponseDto> (`${environment.apiUrl}/account/registration`, body);
  }

  public getTfaSetup = (email: string) => {
    return this.http.get<TfaSetupDto> (`${environment.apiUrl}/account/GenerateQRcode?email=${email}`);
  }

  public enableTfa = (body: TfaSetupDto) => {
    return this.http.post<TfaSetupDto> (`${environment.apiUrl}/account/tfa-setup_Enable`, body);
  }

  public disableTfa = (email: string) => {
    return this.http.delete<TfaSetupDto> (`${environment.apiUrl}/account/tfa-setup_Disable?email=${email}`);
  }

  public loginUser = (body: UserForAuthenticationDto) => {
    return this.http.post<ResponseDto>(`${environment.apiUrl}/account/login`, body);
  }

  public loginUserTfa = (body: TfaDto) => {
    return this.http.post<ResponseDto>(`${environment.apiUrl}/account/login-twoStepVerification`, body);
  }

}
