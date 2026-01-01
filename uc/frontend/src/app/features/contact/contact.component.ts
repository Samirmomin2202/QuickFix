import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  contactForm: FormGroup;
  submitted = false;
  submitSuccess = false;

  contactInfo = [
    {
      icon: 'location_on',
      title: 'Visit Us',
      details: ['123 Service Street', 'Tech Park, Bangalore - 560001', 'Karnataka, India']
    },
    {
      icon: 'phone',
      title: 'Call Us',
      details: ['+91 1800-123-4567', '+91 9876543210', 'Mon-Sun: 8 AM - 10 PM']
    },
    {
      icon: 'email',
      title: 'Email Us',
      details: ['support@quickfix.com', 'info@quickfix.com', 'We reply within 24 hours']
    }
  ];

  faqs = [
    {
      question: 'How do I book a service?',
      answer: 'Simply browse our services, select the one you need, fill in the details, and confirm your booking. A professional will be assigned to you shortly.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit/debit cards, UPI, net banking, and digital wallets. Payment is processed securely through our platform.'
    },
    {
      question: 'Can I reschedule my booking?',
      answer: 'Yes, you can reschedule your booking up to 2 hours before the scheduled time through your bookings page.'
    },
    {
      question: 'Are your professionals verified?',
      answer: 'Absolutely! All our service professionals undergo thorough background verification and skill assessment before joining our platform.'
    },
    {
      question: 'What if I\'m not satisfied with the service?',
      answer: 'Customer satisfaction is our priority. If you\'re not satisfied, please contact our support team within 24 hours for resolution or refund.'
    }
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      subject: ['', Validators.required],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    this.submitted = true;
    
    if (this.contactForm.valid) {
      console.log('Contact Form Submitted:', this.contactForm.value);
      this.submitSuccess = true;
      this.contactForm.reset();
      this.submitted = false;
      
      setTimeout(() => {
        this.submitSuccess = false;
      }, 5000);
    }
  }

  get f() {
    return this.contactForm.controls;
  }
}
