import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  loading = false;
  hidePassword = true;
  returnUrl = '/';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;

      this.authService.login(this.loginForm.value).subscribe({
        next: (response) => {
          this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
          
          // Get current user and redirect based on role
          const user = this.authService.getCurrentUser();
          if (user) {
            if (user.role === 'admin') {
              this.router.navigate(['/admin']);
            } else if (user.role === 'service-provider') {
              this.router.navigate(['/provider/dashboard']);
            } else {
              this.router.navigate([this.returnUrl]);
            }
          } else {
            this.router.navigate([this.returnUrl]);
          }
          this.loading = false;
        },
        error: (error) => {
          this.snackBar.open(error.message || 'Login failed', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
    }
  }
}
