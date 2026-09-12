import { Component, Input, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'ub-enquiry-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  template: `
    <div class="enquiry-panel">
      <h3>Interested? Get in touch.</h3>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <label>Name<input formControlName="customerName" placeholder="Your name"></label>
        <label>Mobile number<input formControlName="mobileNumber" placeholder="Your mobile number"></label>
        <label>Email<input type="email" formControlName="email" placeholder="Your email (optional)"></label>
        <label>Message<textarea formControlName="message" placeholder="Tell us what you're looking for"></textarea></label>
        <button class="button button-dark" type="submit" [disabled]="form.invalid || submitting">{{ submitting ? 'Sending…' : 'Send enquiry' }}</button>
        <p class="form-success" *ngIf="submitted">Thank you! Our team will reach out to you shortly.</p>
        <p class="form-error" *ngIf="error">{{ error }}</p>
      </form>
    </div>
  `
})
export class EnquiryFormComponent {
  @Input() projectId: number | null = null;
  @Input() propertyId: number | null = null;
  private readonly http = inject(HttpClient);
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    customerName: ['', Validators.required],
    mobileNumber: ['', Validators.required],
    email: [''],
    message: ['', Validators.required]
  });
  submitting = false; submitted = false; error = '';

  submit(): void {
    if (this.form.invalid) return;
    this.submitting = true; this.submitted = false; this.error = '';
    this.http.post(`${environment.apiUrl}/enquiries`, {
      ...this.form.getRawValue(),
      projectId: this.projectId,
      propertyId: this.propertyId
    }).subscribe({
      next: () => { this.submitting = false; this.submitted = true; this.form.reset(); },
      error: () => { this.submitting = false; this.error = 'Could not send your enquiry. Please try again.'; }
    });
  }
}
