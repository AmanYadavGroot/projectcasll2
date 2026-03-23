import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationServiceService } from '../Service/authentication-service.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule,CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isTwoFactorEnabled = false;
  constructor(private router: Router, private authService: AuthenticationServiceService ) {}
  ngOnInit(): void {
    const savedState = localStorage.getItem('isTwoFactorEnabled');
    this.isTwoFactorEnabled = savedState === 'true';
  }
  logout(): void {
    localStorage.removeItem("email");
    localStorage.removeItem("token");
 
    this.router.navigate(['/login']);
  }
  onToggleChange(): void {
     if (this.isTwoFactorEnabled) {
      localStorage.setItem('isTwoFactorEnabled', 'true');
      localStorage.setItem('needs2FASetup', 'true');
   } else {
      //  localStorage.setItem('isTwoFactorEnabled', 'false');
      //  localStorage.removeItem('needs2FASetup');
// Disable toggle: call backend to disable 2FA
      const email = localStorage.getItem("email") ?? '';
      this.authService.disableTfa(email).subscribe({
        next: () => {
          localStorage.setItem('isTwoFactorEnabled', 'false');
          localStorage.removeItem('needs2FASetup');
        },
        error: (err: { message: string; }) => {
          console.error("Error disabling 2FA:", err);
          // Optional: Show alert or error message
          alert("Failed to disable 2FA: " + err.message);
          // Rollback toggle change
          this.isTwoFactorEnabled = true;
          localStorage.setItem('isTwoFactorEnabled', 'true');
        
}});}}}