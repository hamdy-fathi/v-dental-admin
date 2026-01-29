import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({ providedIn: 'root' })
export class AutocompleteService {
  #api = inject(ApiService);

  search(entity: string, key: string | null) {
    return this.#api.request('post', 'helpers/global/autocomplete', {
      entity,
      key,
    });
  }

  getStoredData(entity: string, storageKey: string) {
    const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    return storedData[entity] || [];
  }

  storeData(
    entity: string,
    storageKey: string,
    value: { label: string; value: number },
  ) {
    const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');

    if (!storedData[entity]) {
      storedData[entity] = [];
    }

    const exists = storedData[entity].some(
      (item: { value: number; label: string }) => item.value === value.value,
    );

    if (!exists) {
      storedData[entity].push(value);
      localStorage.setItem(storageKey, JSON.stringify(storedData));
    }
  }

  removeStoredItem(entity: string, storageKey: string) {
    const storedData = JSON.parse(localStorage.getItem(storageKey) || '{}');
    if (storedData[entity]) localStorage.removeItem(storageKey);
  }
}
