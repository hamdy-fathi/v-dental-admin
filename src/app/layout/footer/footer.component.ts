import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
@Component({
  selector: 'app-footer',
  template: `
    <div [class]="'p-3 font-semibold ' + className()">
      <p class="text-sm capitalize">
        {{ getDate }}
        &copy;
        {{ 'this platform powered by' | translate }}
        <a
          href="#"
          target="_blank"
          title="V Dental Clinics"
          class="text-blue-500 font-semibold"
          >V Dental Clinics</a
        >
      </p>
    </div>
  `,
  standalone: true,
  imports: [TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent {
  get getDate() {
    return new Date().getFullYear();
  }
  className = input('text-right');
}
