import { inject, Pipe, PipeTransform } from "@angular/core";
import { CachedListsService } from "@gService/cached-lists.service";

@Pipe({
  name: "getLabel",
  pure: false,
})
export class GetLabelPipe implements PipeTransform {
  readonly #cachedLists = inject(CachedListsService);

  transform(id: number | null, listKey: string): string {
    if (!id) return "";

    const label = this.#cachedLists
      .listKeys()
      .get(listKey)
      ?.find((item: { value: number }) => item.value === id)?.label;

    return label || "";
  }
}
