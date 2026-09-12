import { Component, Input } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

interface SliderImage { blobUrl: string; fileName?: string; }

@Component({
  selector: 'ub-image-slider',
  standalone: true,
  imports: [NgFor, NgIf],
  template: `
    <div class="slider" *ngIf="images && images.length; else placeholder">
      <button type="button" class="slider-nav prev" *ngIf="images.length > 1" (click)="prev()" aria-label="Previous image">‹</button>
      <img [src]="images[activeIndex].blobUrl" [alt]="alt + ' image ' + (activeIndex + 1)">
      <button type="button" class="slider-nav next" *ngIf="images.length > 1" (click)="next()" aria-label="Next image">›</button>
      <div class="slider-dots" *ngIf="images.length > 1">
        <span *ngFor="let image of images; let i = index" [class.active]="i === activeIndex" (click)="goTo(i)"></span>
      </div>
    </div>
    <ng-template #placeholder><div class="slider slider-empty"><span>No images available</span></div></ng-template>
  `
})
export class ImageSliderComponent {
  @Input() images: SliderImage[] = [];
  @Input() alt = 'Gallery';
  activeIndex = 0;
  next(): void { this.activeIndex = (this.activeIndex + 1) % this.images.length; }
  prev(): void { this.activeIndex = (this.activeIndex - 1 + this.images.length) % this.images.length; }
  goTo(index: number): void { this.activeIndex = index; }
}
