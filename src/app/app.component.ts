import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'ub-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <header class="topbar">
      <a class="brand" routerLink="/">UDAY<span>BUILDERS</span></a>
      <nav>
        <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">Home</a>
        <a routerLink="/projects" routerLinkActive="active">Projects</a>
        <a routerLink="/properties" routerLinkActive="active">Properties</a>
        <a routerLink="/admin">Admin</a>
        <a class="nav-cta" href="tel:+919876543210">Call us</a>
      </nav>
    </header>
    <main><router-outlet /></main>
    <footer><strong>UDAY BUILDERS</strong><span>Thoughtful spaces. Lasting quality.</span><span>Chennai · Tamil Nadu</span></footer>
  `
})
export class AppComponent {}
