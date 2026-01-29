import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fallback',
})
export class FallbackPipe implements PipeTransform {
  transform(value: any, fallback: string = '——'): string {
    // If the value is null, undefined, or an empty string, return the fallback value
    return value !== null && value !== undefined && value !== ''
      ? value
      : fallback;
  }
}
