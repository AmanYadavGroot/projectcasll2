import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { RegisterUserComponent } from './register-user/register-user.component';
import { LoginComponent } from './login/login.component';
import { TwoStepVertificationComponent } from './two-step-vertification/two-step-vertification.component';
import { TfaSetupComponentComponent } from './tfa-setup-component/tfa-setup-component.component';
import { authGuard } from './Guard/auth.guard';


export const routes: Routes = [

  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'register', component: RegisterUserComponent  },
  { path: 'login', component: LoginComponent },
  { path: 'twostepverification', component: TwoStepVertificationComponent },
  { path: 'tfa-setup', component: TfaSetupComponentComponent, canActivate: [authGuard]  }
];
