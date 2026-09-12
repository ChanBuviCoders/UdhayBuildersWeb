import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../environments/environment';

interface Property { id: number; name: string; type: string; location: string; description: string; area: number; bedrooms: number; sellingPrice: number; mainImageUrl: string; }

@Component({
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, RouterLink],
  template: `
    <section class="page-heading"><p class="eyebrow">AVAILABLE NOW</p><h1>Your next<br><em>address.</em></h1><p>Thoughtfully built homes in places you will love to live.</p></section>
    <section class="cards"><article class="card" *ngFor="let property of properties$ | async" [routerLink]="['/property', property.id]"><img *ngIf="property.mainImageUrl" [src]="property.mainImageUrl" [alt]="property.name"><div class="card-body"><div class="card-meta"><span>AVAILABLE</span><span>{{ property.location }}</span></div><h2>{{ property.name }}</h2><p>{{ property.description }}</p><small>{{ property.type }} · {{ property.area }} sq.ft · {{ property.bedrooms }} bedrooms</small><strong class="price">{{ property.sellingPrice | currency:'INR':'symbol':'1.0-0' }}</strong></div></article></section>
  `
})
export class PropertiesComponent {
  private readonly http = inject(HttpClient);
  readonly properties$ = this.http.get<Property[]>(`${environment.apiUrl}/properties?status=AVAILABLE`);
}
