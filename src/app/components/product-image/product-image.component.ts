import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

interface UploadedImage {
  id: number;
  file: File;
  preview: string;
}

@Component({
  selector: 'app-product-image',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-image.component.html',
  styleUrl: './product-image.component.scss'
})
export class ProductImageComponent {
  @Output() imagesChanged = new EventEmitter<File[]>();

  uploadedImages: UploadedImage[] = [];
  maxImages = 5;
  errorMessage = '';
  private counter = 0;

  onFileSelected(event: any): void {
    const files: FileList = event.target.files;

    if (this.uploadedImages.length + files.length > this.maxImages) {
      this.errorMessage = `Maximum ${this.maxImages} images allowed`;
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.errorMessage = 'Only image files are allowed';
        continue;
      }

      // Validate file size (e.g., 5MB max)
      if (file.size > 5 * 1024 * 1024) {
        this.errorMessage = 'Image size should not exceed 5MB';
        continue;
      }

      this.addImagePreview(file);
    }

    this.emitChanges();
  }

  private addImagePreview(file: File): void {
    const reader = new FileReader();

    reader.onload = (e: any) => {
      this.uploadedImages.push({
        id: this.counter++,
        file: file,
        preview: e.target.result
      });
    };

    reader.readAsDataURL(file);
  }

  removeImage(id: number): void {
    this.uploadedImages = this.uploadedImages.filter(img => img.id !== id);
    this.errorMessage = '';
    this.emitChanges();
  }

  private emitChanges(): void {
    const files = this.uploadedImages.map(img => img.file);
    this.imagesChanged.emit(files);
  }
}
