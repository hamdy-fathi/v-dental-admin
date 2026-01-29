import { Directive, ElementRef, inject, input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appAnimationElement]',
})
export class AnimationElementDirective {
  #el = inject(ElementRef);
  #renderer = inject(Renderer2);

  animationName = input.required<string>();
  animationDelay = input.required<string>();
  animationDuration = input.required<string>();

  ngOnInit(): void {
    this.applyAnimation();
  }

  private applyAnimation() {
    const element = this.#el.nativeElement;

    this.#renderer.setStyle(element, 'animationName', this.animationName());
    this.#renderer.setStyle(element, 'animationDelay', this.animationDelay());
    this.#renderer.setStyle(
      element,
      'animationDuration',
      this.animationDuration(),
    );
  }
}
