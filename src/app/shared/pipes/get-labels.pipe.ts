import { inject, Pipe, PipeTransform } from "@angular/core";
import { CachedListsService } from "@gService/cached-lists.service";

@Pipe({
  name: "getLabels",
  pure: false,
})
export class GetLabelsPipe implements PipeTransform {
  readonly #cachedLists = inject(CachedListsService);

  transform(ids: number[] | null, listKey: string, limit?: number): string {
    if (!ids?.length) return "";

    const options = this.#cachedLists.listKeys().get(listKey);
    if (!options) return "";
    const currentOptions = options?.filter((i: { value: number }) => ids.includes(i.value));
    const labels = currentOptions.map((i: { label: string }) => i.label).join(", ");

    if (limit && labels?.length > limit) {
      return `${labels.slice(0, limit)}...`;
    }

    return labels;
  }
}
