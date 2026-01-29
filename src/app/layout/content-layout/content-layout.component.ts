import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '@layout/footer/footer.component';
import HeaderComponent from '@layout/header/header.component';
import { AnimationElementDirective } from 'src/app/shared/directives/animation-element.directive';

@Component({
  selector: 'app-content-layout',
  imports: [
    HeaderComponent,
    FooterComponent,
    RouterOutlet,
  ],
  templateUrl: './content-layout.component.html',
  styleUrl: './content-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContentLayoutComponent {}
