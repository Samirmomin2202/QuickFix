import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProfileService } from '@core/services/profile.service';
import { Profile } from '@core/models';

interface BankDetails {
  accountHolderName: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  branch?: string;
}

@Component({
  standalone: false,
  selector: 'app-provider-bank-details',
  templateUrl: './provider-bank-details.component.html',
  styleUrls: ['./provider-bank-details.component.scss']
})
export class ProviderBankDetailsComponent implements OnInit {
  bankForm!: FormGroup;
  profile: Profile | null = null;
  loading = false;
  saving = false;
  editing = false;
  bankDetails: BankDetails | null = null;
  
  hideAccountNumber = true;

  constructor(
    private fb: FormBuilder,
    private profileService: ProfileService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProfile();
  }

  initializeForm(): void {
    this.bankForm = this.fb.group({
      accountHolderName: ['', [Validators.required, Validators.minLength(3)]],
      bankName: ['', [Validators.required]],
      accountNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{9,18}$/)]],
      confirmAccountNumber: ['', [Validators.required]],
      ifscCode: ['', [Validators.required, Validators.pattern(/^[A-Z]{4}0[A-Z0-9]{6}$/)]],
      branch: ['']
    }, { validators: this.accountNumberMatchValidator });
  }

  accountNumberMatchValidator(group: FormGroup) {
    const accountNumber = group.get('accountNumber')?.value;
    const confirmAccountNumber = group.get('confirmAccountNumber')?.value;
    return accountNumber === confirmAccountNumber ? null : { accountNumberMismatch: true };
  }

  loadProfile(): void {
    this.loading = true;
    this.profileService.getMyProfile().subscribe({
      next: (response: any) => {
        this.profile = response.data;
        if (this.profile?.bankDetails) {
          this.bankDetails = this.profile.bankDetails as any;
          this.populateForm();
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.loading = false;
      }
    });
  }

  populateForm(): void {
    if (this.bankDetails) {
      this.bankForm.patchValue({
        accountHolderName: this.bankDetails.accountHolderName || '',
        bankName: this.bankDetails.bankName || '',
        accountNumber: this.bankDetails.accountNumber || '',
        confirmAccountNumber: this.bankDetails.accountNumber || '',
        ifscCode: this.bankDetails.ifscCode || '',
        branch: this.bankDetails.branch || ''
      });
    }
  }

  toggleEdit(): void {
    this.editing = !this.editing;
    if (!this.editing) {
      this.populateForm();
    }
  }

  onSubmit(): void {
    if (this.bankForm.invalid) {
      Object.keys(this.bankForm.controls).forEach(key => {
        this.bankForm.controls[key].markAsTouched();
      });
      return;
    }

    this.saving = true;
    const formValue = this.bankForm.value;
    
    const bankData = {
      accountHolderName: formValue.accountHolderName,
      bankName: formValue.bankName,
      accountNumber: formValue.accountNumber,
      ifscCode: formValue.ifscCode.toUpperCase(),
      branch: formValue.branch
    };

    // In a real application, you would have a dedicated endpoint for bank details
    // For now, we'll update the profile with bank details
    this.profileService.updateProfile({ bankDetails: bankData } as any).subscribe({
      next: (response: any) => {
        alert('Bank details updated successfully!');
        this.saving = false;
        this.editing = false;
        this.loadProfile();
      },
      error: (error) => {
        alert('Error updating bank details: ' + error.message);
        this.saving = false;
      }
    });
  }

  maskAccountNumber(accountNumber: string): string {
    if (!accountNumber || accountNumber.length < 4) return '****';
    const visibleDigits = accountNumber.slice(-4);
    const maskedPart = '*'.repeat(accountNumber.length - 4);
    return maskedPart + visibleDigits;
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      alert('Copied to clipboard!');
    });
  }
}
