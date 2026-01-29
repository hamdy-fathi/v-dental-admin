import { inject, Injectable } from "@angular/core";
import { CachedListsService } from "./cached-lists.service";

@Injectable({
  providedIn: "root",
})
export class CachedLabelsService {
  #cachedLists = inject(CachedListsService);

  getLabelsByIds(listKey: string, ids: number[]) {
    const options = this.#cachedLists.listKeys().get(listKey);
    return options?.filter((item: { value: number }) => ids?.includes(item.value)) || [];
  }

  getLabelById(listKey: string, id: number) {
    return this.#cachedLists
      .listKeys()
      .get(listKey)
      ?.find((item: { value: number }) => item.value === id)?.label;
  }

  getNestedLabelsByIds(listKey: string, ids: number[]) {
    const data = this.#cachedLists.listKeys().get(listKey);

    return data
      .map((group: { value: any; label: string; items?: { value: any; label: string }[] }) => {
        const filteredItems = group.items?.filter(item => ids.includes(item.value)) || [];
        return filteredItems.length ? { ...group, items: filteredItems } : null;
      })
      .filter(Boolean);
  }

  getNestedLabelById(listKey: string, id: number) {
    const data = this.#cachedLists.listKeys().get(listKey);
    for (const group of data) {
      return group.items.find((item: { value: number }) => item.value === id).label;
    }
  }
}
