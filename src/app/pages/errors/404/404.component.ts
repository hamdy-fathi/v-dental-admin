import { ChangeDetectionStrategy, Component } from '@angular/core';
import anime from 'animejs';

@Component({
  selector: 'app-not-found',
  templateUrl: './404.component.html',
  styleUrls: ['./404.component.scss'],
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class Error404Component {
  ngAfterViewInit() {
    anime({
      targets: 'svg',
      translateY: 10,
      autoplay: true,
      loop: true,
      easing: 'easeInOutSine',
      direction: 'alternate',
    });

    anime({
      targets: '#zero',
      translateX: 10,
      autoplay: true,
      loop: true,
      easing: 'easeInOutSine',
      direction: 'alternate',
      scale: [{ value: 1 }, { value: 1.4 }, { value: 1, delay: 250 }],
      rotateY: { value: '+=180', delay: 200 },
    });
  }
}
