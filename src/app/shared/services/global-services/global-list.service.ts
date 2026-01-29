import { inject, Injectable } from '@angular/core';
import { map, shareReplay } from 'rxjs';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class GlobalListService {
  #api = inject(ApiService);

  getGlobalList(slug: string) {
    return this.#api.request('get', `lists/slug/${slug}`).pipe(
      map(({ data }) => data),
      shareReplay(1),
    );
  }
}
