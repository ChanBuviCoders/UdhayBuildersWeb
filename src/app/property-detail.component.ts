import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { switchMap, combineLatest, map } from 'rxjs';
import { environment } from '../environments/environment';
import { ImageSliderComponent } from './image-slider.component';
import { EnquiryFormComponent } from './enquiry-form.component';

interface Property {
  id: number; name: string; type: string; location: string; address: string; description: string;
  area: number; builtUpArea: number; landArea: number; bedrooms: number; bathrooms: number; floors: number;
  parkingAvailable: boolean; constructionYear: number; features: string; status: string; sellingPrice: number;
  mainImageUrl: string;
}
interface StoredImage { blobUrl: string; fileName: string; }

@Component({
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, RouterLink, ImageSliderComponent, EnquiryFormComponent],
  template: `
    <ng-container *ngIf="detail$ | async as detail">
      <section class="detail-hero">
        <ub-image-slider [images]="detail.images" [alt]="detail.property.name"></ub-image-slider>
      </section>
      <section class="detail-body">
        <div class="detail-main">
          <p class="eyebrow">{{ detail.property.status }}</p>
          <h1>{{ detail.property.name }}</h1>
          <p class="detail-location">{{ detail.property.location }}<span *ngIf="detail.property.address"> · {{ detail.property.address }}</span></p>
          <div class="detail-stats">
            <div><strong>{{ detail.property.sellingPrice | currency:'INR':'symbol':'1.0-0' }}</strong><span>Price</span></div>
            <div><strong>{{ detail.property.bedrooms }} BHK</strong><span>Configuration</span></div>
            <div><strong>{{ detail.property.area }} sq.ft</strong><span>Area</span></div>
            <div *ngIf="detail.property.bathrooms"><strong>{{ detail.property.bathrooms }}</strong><span>Bathrooms</span></div>
          </div>
          <h2>About this property</h2>
          <p class="detail-copy">{{ detail.property.description }}</p>
          <ng-container *ngIf="detail.property.features">
            <h2>Amenities</h2>
            <ul class="detail-list"><li *ngFor="let feature of splitFeatures(detail.property.features)">{{ feature }}</li></ul>
          </ng-container>
        </div>
        <aside class="detail-side">
          <ub-enquiry-form [propertyId]="detail.property.id"></ub-enquiry-form>
        </aside>
      </section>
    </ng-container>
  `
})
export class PropertyDetailComponent {
  private readonly http = inject(HttpClient);
  private readonly route = inject(ActivatedRoute);
  readonly detail$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      const property$ = this.http.get<Property>(`${environment.apiUrl}/properties/${id}`);
      const images$ = this.http.get<StoredImage[]>(`${environment.apiUrl}/properties/${id}/images`);
      return combineLatest([property$, images$]).pipe(map(([property, images]) => ({ property, images })));
    })
  );
  splitFeatures(features: string): string[] {
    return features.split(/[\n,]/).map(f => f.trim()).filter(Boolean);
  }
}
