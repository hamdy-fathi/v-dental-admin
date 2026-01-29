import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'jsonParse' })
export class JsonParsePipe implements PipeTransform {
  transform(value: string) {
    if (!value) return [];
    const parsedObject = JSON.parse(value);
    return Object.keys(parsedObject).map(key => ({
      label: parsedObject[key],
      value: key
    }));
  }
}