import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { GalleriaModule } from 'primeng/galleria';

@Component({
  selector: 'app-show-model-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, GalleriaModule],
  templateUrl: './show-model-dialog.component.html',
  styleUrl: './show-model-dialog.component.scss'
})
export class ShowModelDialogComponent {

}
