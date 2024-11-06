import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appProductStatus]',
  standalone: true
})
export class ProductStatusDirective implements OnInit {
  @Input('appProductStatus') status!: 'NEW' | 'BEST SELLER';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit(): void {
    this.createBadge();
  }

  private createBadge() {
    const badge = this.renderer.createElement('span');
    const text = this.status === 'NEW' ? 'NEW' : 'BEST SELLER';

    this.renderer.appendChild(badge, this.renderer.createText(text));
    this.renderer.appendChild(this.el.nativeElement, badge);

    // Set badge styles
    this.renderer.setStyle(badge, 'position', 'absolute');
    this.renderer.setStyle(badge, 'top', '8px');
    this.renderer.setStyle(badge, 'left', '8px');
    this.renderer.setStyle(badge, 'backgroundColor', this.status === 'NEW' ? '#e0f7fa' : '#ffe0b2');
    this.renderer.setStyle(badge, 'color', this.status === 'NEW' ? '#00796b' : '#e65100');
    this.renderer.setStyle(badge, 'padding', '4px 8px');
    this.renderer.setStyle(badge, 'borderRadius', '4px');
    this.renderer.setStyle(badge, 'fontWeight', 'bold');
    this.renderer.setStyle(badge, 'zIndex', '10');
  }
}
