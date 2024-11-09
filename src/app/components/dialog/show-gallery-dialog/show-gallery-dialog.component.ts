import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-show-gallery-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, GalleriaModule],
  templateUrl: './show-gallery-dialog.component.html',
  styleUrl: './show-gallery-dialog.component.scss'
})
export class ShowGalleryDialogComponent {
  images: any[] = [
    {
      itemImageSrc: 'https://primeng.org/images/galleria/galleria1.jpg',
      thumbnailImageSrc: 'https://primeng.org/images/galleria/galleria1s.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1'
    },
  ]
}
