import { Component, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AsyncPipe, CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from '../environments/environment';

interface Project { id: number; name: string; type: string; location: string; description: string; status: string; area: number; bedrooms: number; mainImageUrl: string; }

@Component({
  standalone: true,
  imports: [AsyncPipe, CurrencyPipe, NgFor, NgIf, RouterLink],
  template: `
    <section class="page-heading"><p class="eyebrow">OUR WORK</p><h1>Projects with<br><em>purpose.</em></h1><p>Explore a selection of homes and spaces shaped by our team.</p></section>
    <section class="cards"><article class="card" *ngFor="let project of projects$ | async" [routerLink]="['/project', project.id]"><img *ngIf="project.mainImageUrl" [src]="project.mainImageUrl" [alt]="project.name"><div class="card-body"><div class="card-meta"><span>{{ project.status }}</span><span>{{ project.location }}</span></div><h2>{{ project.name }}</h2><p>{{ project.description }}</p><small>{{ project.type }} · {{ project.area }} sq.ft · {{ project.bedrooms }} bedrooms</small></div></article></section>
  `
})
export class ProjectsComponent {
  private readonly http = inject(HttpClient);
  readonly projects$ = this.http.get<Project[]>(`${environment.apiUrl}/projects`);
}
