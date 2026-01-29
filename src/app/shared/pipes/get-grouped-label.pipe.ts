import { inject, Pipe, PipeTransform } from "@angular/core";
import { CachedListsService } from "@gService/cached-lists.service";

@Pipe({
  name: "getGroupedLabel",
  pure: false,
})
export class GetGroupedLabelPipe implements PipeTransform {
  readonly #cachedLists = inject(CachedListsService);

  transform(id: number | null, listKey: string): string {
    if (!id) return "";

    const list = this.#cachedLists.listKeys().get(listKey);
    if (!list) return "";

    for (const group of list) {
      if (group.items?.length) {
        const nestedItem = group.items.find((item: { value: any }) => item.value === id);
        if (nestedItem) return nestedItem.label;
      }
    }

    return "";
  }
}
