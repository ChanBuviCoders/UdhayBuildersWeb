import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';
import { environment } from '../environments/environment';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <section class="admin-shell" *ngIf="!auth.isAuthenticated(); else dashboard">
      <div class="admin-card"><p class="eyebrow">CONTENT MANAGEMENT</p><h1>Admin <em>login.</em></h1>
        <form [formGroup]="loginForm" (ngSubmit)="login()">
          <label>Email<input type="email" formControlName="email"></label>
          <label>Password<input type="password" formControlName="password"></label>
          <p class="form-error" *ngIf="error">{{ error }}</p><button class="button button-dark" type="submit" [disabled]="loginForm.invalid">Sign in</button>
        </form>
      </div>
    </section>
    <ng-template #dashboard><section class="admin-shell">
      <div class="admin-header"><div><p class="eyebrow">ADMINISTRATION</p><h1>Good morning.</h1></div><button class="button button-outline" (click)="logout()">Sign out</button></div>
      <div class="dashboard-grid"><div *ngFor="let card of cards" class="dashboard-card"><strong>{{ dashboardData[card.key] }}</strong><span>{{ card.label }}</span></div></div>
      <div class="admin-panel"><h2>Projects</h2><form [formGroup]="projectForm" (ngSubmit)="saveProject()"><div class="form-grid">
        <input placeholder="Project name" formControlName="name"><input placeholder="Type" formControlName="type"><input placeholder="Category" formControlName="category"><input placeholder="Location" formControlName="location">
        <input placeholder="Status (PLANNED/ONGOING/COMPLETED/SOLD)" formControlName="status"><input type="number" placeholder="Area sq.ft" formControlName="area"><input type="number" placeholder="Bedrooms" formControlName="bedrooms"><input type="number" placeholder="Bathrooms" formControlName="bathrooms">
        <textarea placeholder="Description" formControlName="description"></textarea><textarea placeholder="Additional features" formControlName="additionalFeatures"></textarea>
      </div>
      <label>Card image (required)<input type="file" accept="image/jpeg,image/png,image/webp" required (change)="selectProjectImage($event)"></label>
      <p class="form-hint">A photo is mandatory &mdash; projects without a photo will not appear on the public site.</p>
      <p class="form-error" *ngIf="projectImageMessage">{{ projectImageMessage }}</p>
      <button class="button button-dark" type="submit" [disabled]="projectForm.invalid || !projectImage || savingProject">Create project</button></form></div>
      <div class="admin-panel"><h2>Properties</h2><form [formGroup]="propertyForm" (ngSubmit)="saveProperty()"><div class="form-grid">
        <input placeholder="Property name" formControlName="name"><input placeholder="Type" formControlName="type"><input placeholder="Location" formControlName="location"><input placeholder="Address" formControlName="address">
        <input placeholder="Status (AVAILABLE/SOLD)" formControlName="status"><input type="number" placeholder="Area sq.ft" formControlName="area"><input type="number" placeholder="Bedrooms" formControlName="bedrooms"><input type="number" placeholder="Bathrooms" formControlName="bathrooms">
        <input type="number" placeholder="Selling price" formControlName="sellingPrice"><textarea placeholder="Description" formControlName="description"></textarea>
      </div>
      <label>Card image (required)<input type="file" accept="image/jpeg,image/png,image/webp" required (change)="selectPropertyImage($event)"></label>
      <p class="form-hint">A photo is mandatory &mdash; properties without a photo will not appear on the public site.</p>
      <p class="form-error" *ngIf="propertyImageMessage">{{ propertyImageMessage }}</p>
      <button class="button button-dark" type="submit" [disabled]="propertyForm.invalid || !propertyImage || savingProperty">Create property</button></form></div>
      <div class="admin-panel"><h2>Image storage</h2><p>Images are uploaded to Azure Blob Storage through the protected API.</p><div class="form-grid"><select [(ngModel)]="imageOwnerType" [ngModelOptions]="{standalone: true}"><option value="projects">Project</option><option value="properties">Property</option></select><input type="text" placeholder="Project or property ID" [(ngModel)]="imageOwnerId" [ngModelOptions]="{standalone: true}"><input type="file" accept="image/jpeg,image/png,image/webp" (change)="selectImage($event)"></div><button class="button button-dark" (click)="uploadImage()" [disabled]="!selectedImage || !imageOwnerId">Upload image</button><p class="form-error" *ngIf="imageMessage">{{ imageMessage }}</p></div>
    </section></ng-template>
  `
})
export class AdminComponent {
  readonly auth = inject(AuthService); private readonly http = inject(HttpClient); private readonly router = inject(Router); private readonly fb = inject(FormBuilder);
  readonly loginForm = this.fb.nonNullable.group({ email: ['', [Validators.required, Validators.email]], password: ['', Validators.required] });
  readonly projectForm = this.fb.nonNullable.group({ name: ['', Validators.required], type: ['', Validators.required], category: [''], location: ['', Validators.required], status: ['PLANNED', Validators.required], area: [0, Validators.required], bedrooms: [0], bathrooms: [0], description: ['', Validators.required], additionalFeatures: [''] });
  readonly propertyForm = this.fb.nonNullable.group({ name: ['', Validators.required], type: ['', Validators.required], location: ['', Validators.required], address: [''], status: ['AVAILABLE', Validators.required], area: [0, Validators.required], bedrooms: [0], bathrooms: [0], sellingPrice: [0, Validators.required], description: ['', Validators.required] });
  imageOwnerType = 'projects'; imageOwnerId = ''; selectedImage: File | null = null; imageMessage = '';
  projectImage: File | null = null; projectImageMessage = ''; savingProject = false;
  propertyImage: File | null = null; propertyImageMessage = ''; savingProperty = false;
  error = ''; dashboardData: Record<string, number> = {};
  readonly cards = [{ key: 'totalProjects', label: 'Total projects' }, { key: 'completedProjects', label: 'Completed' }, { key: 'ongoingProjects', label: 'Ongoing' }, { key: 'totalProperties', label: 'Properties' }, { key: 'availableProperties', label: 'Available' }, { key: 'newEnquiries', label: 'New enquiries' }];
  constructor() { if (this.auth.isAuthenticated()) this.loadDashboard(); }
  login(): void { if (this.loginForm.invalid) return; this.auth.login(this.loginForm.value.email!, this.loginForm.value.password!).subscribe({ next: () => this.loadDashboard(), error: () => this.error = 'Invalid administrator credentials.' }); }
  loadDashboard(): void { this.http.get<Record<string, number>>(`${environment.apiUrl}/admin/dashboard`).subscribe({ next: data => this.dashboardData = data, error: () => { this.auth.logout(); this.router.navigate(['/admin/login']); } }); }
  selectProjectImage(event: Event): void { const input = event.target as HTMLInputElement; this.projectImage = input.files?.[0] ?? null; this.projectImageMessage = ''; }
  selectPropertyImage(event: Event): void { const input = event.target as HTMLInputElement; this.propertyImage = input.files?.[0] ?? null; this.propertyImageMessage = ''; }
  saveProject(): void {
    if (this.projectForm.invalid || !this.projectImage) { this.projectImageMessage = !this.projectImage ? 'A card image is required to create a project.' : ''; return; }
    this.savingProject = true;
    this.http.post<{ id: number }>(`${environment.apiUrl}/projects`, this.projectForm.getRawValue()).subscribe({
      next: created => {
        const formData = new FormData(); formData.append('file', this.projectImage!);
        this.http.post(`${environment.apiUrl}/projects/${created.id}/images`, formData).subscribe({
          next: () => { this.projectForm.reset({ status: 'PLANNED', area: 0, bedrooms: 0, bathrooms: 0 }); this.projectImage = null; this.projectImageMessage = ''; this.savingProject = false; this.loadDashboard(); },
          error: () => { this.projectImageMessage = 'Project created, but the image upload failed. Please add a photo below.'; this.savingProject = false; this.loadDashboard(); }
        });
      },
      error: () => { this.projectImageMessage = 'Failed to create project.'; this.savingProject = false; }
    });
  }
  saveProperty(): void {
    if (this.propertyForm.invalid || !this.propertyImage) { this.propertyImageMessage = !this.propertyImage ? 'A card image is required to create a property.' : ''; return; }
    this.savingProperty = true;
    this.http.post<{ id: number }>(`${environment.apiUrl}/properties`, { ...this.propertyForm.getRawValue(), parkingAvailable: false, featured: false }).subscribe({
      next: created => {
        const formData = new FormData(); formData.append('file', this.propertyImage!);
        this.http.post(`${environment.apiUrl}/properties/${created.id}/images`, formData).subscribe({
          next: () => { this.propertyForm.reset({ status: 'AVAILABLE', area: 0, bedrooms: 0, bathrooms: 0, sellingPrice: 0 }); this.propertyImage = null; this.propertyImageMessage = ''; this.savingProperty = false; this.loadDashboard(); },
          error: () => { this.propertyImageMessage = 'Property created, but the image upload failed. Please add a photo below.'; this.savingProperty = false; this.loadDashboard(); }
        });
      },
      error: () => { this.propertyImageMessage = 'Failed to create property.'; this.savingProperty = false; }
    });
  }
  selectImage(event: Event): void { const input = event.target as HTMLInputElement; this.selectedImage = input.files?.[0] ?? null; }
  uploadImage(): void {
    if (!this.selectedImage || !this.imageOwnerId) return;
    const formData = new FormData(); formData.append('file', this.selectedImage);
    this.http.post(`${environment.apiUrl}/${this.imageOwnerType}/${this.imageOwnerId}/images`, formData).subscribe({
      next: () => { this.imageMessage = 'Image uploaded successfully.'; this.selectedImage = null; },
      error: () => this.imageMessage = 'Image upload failed. Check Azure Storage configuration and file type.'
    });
  }
  logout(): void { this.auth.logout(); this.router.navigate(['/admin/login']); }
}