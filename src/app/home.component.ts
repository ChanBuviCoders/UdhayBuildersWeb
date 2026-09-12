import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="hero">
      <div class="hero-content">
        <p class="eyebrow">CONSTRUCTION · PROPERTY · TRUST</p>
        <h1>Building spaces.<br><em>Creating futures.</em></h1>
        <p class="hero-copy">From the first line on a blueprint to the final key in your hand, we build with care, clarity and craft.</p>
        <div class="actions"><a class="button button-dark" routerLink="/projects">Explore our work</a><a class="text-link" routerLink="/properties">Find a property →</a></div>
      </div>
      <div class="hero-stat"><strong>15+</strong><span>years of<br>building better</span></div>
    </section>
    <section class="intro">
      <p class="eyebrow">WHY UDAY BUILDERS</p><h2>Good buildings begin<br>with <em>good thinking.</em></h2>
      <p class="lead">We are a construction and property company focused on creating spaces that feel considered, perform beautifully and stand the test of time.</p>
    </section>
    <section class="split-cta">
      <div><p class="eyebrow">OUR PORTFOLIO</p><h2>Work that speaks<br>for itself.</h2><a class="button button-light" routerLink="/projects">View projects</a></div>
      <div><p class="eyebrow">PROPERTY SALES</p><h2>Find your next<br><em>address.</em></h2><a class="button button-outline" routerLink="/properties">Browse properties</a></div>
    </section>
  `
})
export class HomeComponent {}
