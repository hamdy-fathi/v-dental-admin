import { inject, Pipe, PipeTransform } from "@angular/core";
import { CachedListsService } from "@gService/cached-lists.service";

@Pipe({
  name: "getGroupedLabels",
  pure: false,
})
export class GetGroupedLabelsPipe implements PipeTransform {
  readonly #cachedLists = inject(CachedListsService);

  transform(ids: number[], listKey: string, limit?: number): string {
    if (!ids?.length) return "";

    const list = this.#cachedLists.listKeys().get(listKey);
    if (!list) return "";

    const labels: string[] = [];

    for (const group of list) {
      if (group.items?.length) {
        const matchingItems = group.items.filter((item: { value: any }) =>
          ids.includes(item.value),
        );
        labels.push(...matchingItems.map((item: { label: string }) => item.label));
      }
    }

    const result = labels.join(", ");

    if (limit && result.length > limit) {
      return `${result.slice(0, limit)}...`;
    }

    return result;
  }
}
