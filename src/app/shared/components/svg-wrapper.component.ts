import { Component, Input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-svg-wrapper',
  template: `
    <svg
      xmlns="http://www.w3.org/2000/svg"
      [attr.viewBox]="viewBox"
      [attr.width]="width"
      [attr.height]="height"
      [attr.class]="svgClass"
      [attr.style]="svgStyle"
    >
      @if (groupContent) {
        <g [innerHTML]="groupContent"></g>
      }
      @if (!groupContent) {
        <ng-content></ng-content>
      }
    </svg>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      svg {
        display: block;
        max-width: 100%;
        max-height: 100%;
      }
    `,
  ],
  standalone: true,
})
export class SvgWrapperComponent {
  @Input() viewBox: string = '0 0 30 30';
  @Input() width: string | number = '100%';
  @Input() height: string | number = '100%';
  @Input() svgClass: string = '';
  @Input() svgStyle: string = '';
  @Input() groupContent: SafeHtml | string = '';

  constructor(private sanitizer: DomSanitizer) {}

  setGroupContent(content: string) {
    this.groupContent = this.sanitizer.bypassSecurityTrustHtml(content);
  }

  setGroupContentSafe(content: SafeHtml) {
    this.groupContent = content;
  }
}
