import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  effect,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { addDays, addHours, addMinutes, addWeeks, format } from 'date-fns';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DatePicker } from 'primeng/datepicker';
import { FloatLabel } from 'primeng/floatlabel';
import { TabsModule } from 'primeng/tabs';
import { TooltipModule } from 'primeng/tooltip';
import { distinctUntilChanged, filter, tap } from 'rxjs';
import { RoundMinuteDirective } from './round-minute.directive';

@Component({
  selector: 'formly-data-picker-field',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
  imports: [
    TooltipModule,
    RoundMinuteDirective,
    FormlyModule,
    DatePicker,
    NgClass,
    FloatLabel,
    TabsModule,
    ButtonModule,
    ReactiveFormsModule,
    TranslateModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatePickerComponent extends FieldType<FieldTypeConfig> {
  #destroyRef = inject(DestroyRef);
  #translate = inject(TranslateService);

  datePicker = viewChild<DatePicker>('datePicker');

  forceDisplay = signal<boolean>(false);
  activeIndex = signal<number | null>(null);

  presetItems = signal<MenuItem[]>([
    {
      label: this.#translate.instant(_('after_15_minutes')),
      amount: 15,
    },
    {
      label: this.#translate.instant(_('after_30_minutes')),
      amount: 30,
    },
    {
      label: this.#translate.instant(_('after_1_hour')),
      amount: 1,
      unit: 'hour',
    },
    {
      label: this.#translate.instant(_('after_2_hours')),
      amount: 2,
      unit: 'hour',
    },
    {
      label: this.#translate.instant(_('after_3_hours')),
      amount: 3,
      unit: 'hour',
    },
    {
      label: this.#translate.instant(_('tomorrow')),
      amount: 1,
      unit: 'day',
    },
    {
      label: this.#translate.instant(_('day_after_tom')),
      amount: 2,
      unit: 'day',
    },
    {
      label: this.#translate.instant(_('after_1_week')),
      amount: 1,
      unit: 'week',
    },
    {
      label: this.#translate.instant(_('after_2_weeks')),
      amount: 2,
      unit: 'week',
    },
  ]);

  effect = effect(() => {
    if (this.props.withPresets && this.forceDisplay() && this.datePicker()) {
      this.datePicker()?.inputfieldViewChild?.nativeElement.focus();
    }
  });

  handlePresetClick(index: number, amount: number, unit = 'minute') {
    this.forceDisplay.set(false);
    this.activeIndex.set(index);
    this.addToNow(amount, unit);
  }

  ngOnInit() {
    if (this.formControl?.value && this.field.model.id) {
      // check if field has a value (if it was edit mode)
      const value = this.formControl.value; // "Oct 25, 2023" or "Oct 25, 2023 | 02:03 PM"
      const dateKey = this.field.key;

      const formatString = this.props.showTime
        ? 'yyyy-MM-dd HH:mm:ss'
        : 'yyyy-MM-dd';

      const formattedDate = format(new Date(value), formatString);
      this.field.model[dateKey as string] = formattedDate;
    }

    this.formControl.valueChanges
      .pipe(
        filter((v) => !!v),
        distinctUntilChanged(),
        tap((value) => {
          const dateKey = this.field.key;
          let formattedDate;

          if (Array.isArray(value) && value.length === 2) {
            // Handle the date range array
            const [startDate, endDate] = value;
            const formatString = this.props.showTime
              ? 'yyyy-MM-dd HH:mm:ss'
              : 'yyyy-MM-dd';
            const formattedStartDate = format(
              new Date(startDate),
              formatString,
            );
            const formattedEndDate = format(new Date(endDate), formatString);
            formattedDate = `${formattedStartDate} / ${formattedEndDate}`;
          } else {
            // Handle single date value
            formattedDate = this.props.showTime
              ? format(new Date(value), 'yyyy-MM-dd HH:mm:ss')
              : format(new Date(value), 'yyyy-MM-dd');
          }

          this.field.model[dateKey as string] = formattedDate;
        }),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe();
  }

  addToNow(amount: number, unit = 'minute') {
    const currentDate = new Date();
    let presetDate: Date;

    switch (unit) {
      case 'minute':
        presetDate = addMinutes(currentDate, amount);
        break;
      case 'hour':
        presetDate = addHours(currentDate, amount);
        break;
      case 'day':
        presetDate = addDays(currentDate, amount);
        break;
      case 'week':
        presetDate = addWeeks(currentDate, amount);
        break;
      default:
        presetDate = currentDate;
        break;
    }

    this.formControl?.setValue(presetDate);
  }

  onClearClick(e: any) {
    e.stopPropagation();
    this.formControl?.setValue(null);
  }
}
