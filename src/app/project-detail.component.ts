import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { switchMap, combineLatest, map } from 'rxjs';
import { environment } from '../environments/environment';
import { ImageSliderComponent } from './image-slider.component';
import { EnquiryFormComponent } from './enquiry-form.component';

interface Project {
  id: number; name: string; type: string; category: string; location: string; description: string;
  additionalFeatures: string; status: string; area: number; floors: number; bedrooms: number; bathrooms: number;
  startDate: string; completionDate: string; sellingPrice: number; mainImageUrl: string;
}
interface StoredImage { blobUrl: string; fileName: string; }

@Component({
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, RouterLink, ImageSliderComponent, EnquiryFormComponent],
  template: `
    <ng-container *ngIf="detail$ | async as detail">
      <section class="detail-hero">
        <ub-image-slider [images]="detail.images" [alt]="detail.project.name"></ub-image-slider>
      </section>
      <section class="detail-body">
        <div class="detail-main">
          <p class="eyebrow">{{ detail.project.status }}</p>
          <h1>{{ detail.project.name }}</h1>
          <p class="detail-location">{{ detail.project.location }}</p>
          <div class="detail-stats">
            <div *ngIf="detail.project.sellingPrice"><strong>{{ detail.project.sellingPrice | currency:'INR':'symbol':'1.0-0' }}</strong><span>Starting from</span></div>
            <div *ngIf="detail.project.area"><strong>{{ detail.project.area }} sq.ft</strong><span>Area</span></div>
            <div *ngIf="detail.project.bedrooms"><strong>{{ detail.project.bedrooms }} BHK</strong><span>Configuration</span></div>
            <div *ngIf="detail.project.floors"><strong>{{ detail.project.floors }}</strong><span>Floors</span></div>
          </div>

          <h2>Project overview</h2>
          <ul class="detail-list">
            <li *ngIf="detail.project.type">Type: {{ detail.project.type }}</li>
            <li *ngIf="detail.project.category">Category: {{ detail.project.category }}</li>
            <li *ngIf="detail.project.startDate">Start date: {{ detail.project.startDate }}</li>
            <li *ngIf="detail.project.completionDate">Completion date: {{ detail.project.completionDate }}</li>
          </ul>

          <h2>About this project</h2>
          <p class="detail-copy">{{ detail.project.description }}</p>

          <ng-container *ngIf="detail.project.bedrooms || detail.project.bathrooms || detail.project.floors">
            <h2>Configuration</h2>
            <ul class="detail-list">
              <li *ngIf="detail.project.bedrooms">{{ detail.project.bedrooms }} bedrooms</li>
              <li *ngIf="detail.project.bathrooms">{{ detail.project.bathrooms }} bathrooms</li>
              <li *ngIf="detail.project.floors">{{ detail.project.floors }} floors</li>
            </ul>
          </ng-container>

          <ng-container *ngIf="detail.project.additionalFeatures">
            <h2>Amenities</h2>
            <ul class="detail-list"><li *ngFor="let feature of splitFeatures(detail.project.additionalFeatures)">{{ feature }}</li></ul>
          </ng-container>

          <h2>Location advantages</h2>
          <p class="detail-copy">Well connected in and around {{ detail.project.location }}. Contact our team for a detailed location and connectivity brief.</p>

          <h2>Floor plans</h2>
          <p class="detail-copy">Floor plans are available on request. Reach out using the enquiry form and our team will share detailed layouts.</p>
        </div>
        <aside class="detail-side">
          <ub-enquiry-form [projectId]="detail.project.id"></ub-enquiry-form>
        </aside>
      </section>
    </ng-container>
  `
})
export class ProjectDetailComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  readonly detail$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      const project$ = this.http.get<Project>(`${environment.apiUrl}/projects/${id}`);
      const images$ = this.http.get<StoredImage[]>(`${environment.apiUrl}/projects/${id}/images`);
      return combineLatest([project$, images$]).pipe(map(([project, images]) => ({ project, images })));
    })
  );
  splitFeatures(features: string): string[] {
    return features.split(/[\n,]/).map(f => f.trim()).filter(Boolean);
  }
}
