import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment-timezone';
import { constants } from '../config';

@Pipe({
  name: 'dateFormatter',
  standalone: true,
})
export class DateFormatterPipe implements PipeTransform {
  transform(
    value: string,
    outputType: 'both' | 'relative' | 'absolute' = 'both',
    dateFormat: string = constants.DATE_FORMAT,
    outputFormat: string = 'MMM D, YYYY | hh:mm A',
    timezone: string = 'Africa/Cairo',
  ) {
    if (!value) return '';

    const utcDate = moment.utc(value, dateFormat);
    const timezoneDate = utcDate.tz(timezone);
    const formattedDate = timezoneDate.format(outputFormat);
    const relativeTime = timezoneDate.fromNow();

    switch (outputType) {
      case 'absolute':
        return formattedDate;
      case 'relative':
        return relativeTime;
      case 'both':
      default:
        return `${relativeTime}, ${formattedDate}`;
    }
  }
}
