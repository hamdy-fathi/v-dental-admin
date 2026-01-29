import { ComponentType } from '@angular/cdk/portal';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  model,
  signal,
} from '@angular/core';
import {
  takeUntilDestroyed,
  toObservable,
  toSignal,
} from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent } from 'primeng/api';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { catchError, filter, map, of, switchMap, tap } from 'rxjs';
import { constants } from '../../config';
import { createDialogConfig } from '../../helpers';
import { ContentByLanguagePipe } from '../../pipes';
import {
  ApiService,
  BaseCrudIndexMeta,
  ConfirmService,
  FiltersData,
  LangService,
  RoleService,
} from '../../services';

interface item {
  id?: number | null;
  order?: number | null;
}

@Component({
  selector: 'app-base-index',
  template: '', // Placeholder template as it will not be directly used
  changeDetection: ChangeDetectionStrategy.OnPush,
})
/*
Abstract classes don't exist as part of the JavaScript language, they are a specific TypeScript feature. when we see the word abstract we never call that class directly - we only inherit from it. It is a naming convention given to a class in TypeScript that says "only inherit from me". If we call that class directly, TypeScript will throw an error and not let we as it is marked as abstract.
*/
export abstract class BaseIndexComponent<
  T extends item,
  C extends ComponentType<unknown> = ComponentType<unknown>,
> {
  public api = inject(ApiService);
  public translate = inject(TranslateService);
  public confirmService = inject(ConfirmService);
  public langService = inject(LangService);
  public destroyRef = inject(DestroyRef);
  public dialogService = inject(DialogService);
  public router = inject(Router);
  public dialogRef: DynamicDialogRef | undefined;

  clearCachingLists = signal<string[]>([]);
  showView = signal(false);
  recordView = signal({} as T);
  contentByLanguagePipe = inject(ContentByLanguagePipe);
  userRoles = inject(RoleService);
  #route = inject(ActivatedRoute);
  records = signal<T[]>([]);
  totalRecords = signal<number>(0);
  recordsFiltered = signal<number>(0);
  globalFilterValue = signal<string | null>('');
  isListLayout = signal(true);
  withMultiLayout = signal(false);
  isLoading = signal(true);
  displayFilters = signal(false);
  filtersData = model<FiltersData | null>(null);
  rows = signal(constants.TABLE_ROWS_LENGTH);
  dialogComponent!: C;
  indexMeta = new BaseCrudIndexMeta();
  roles = signal<{ [key: string]: boolean }>({
    index: true,
    create: true,
    update: true,
    show: true,
    delete: true,
  });

  loadRecords$ = toObservable(this.filtersData).pipe(
    filter((filters) => !!filters && filters.start !== undefined),
    map((filters) =>
      Object.fromEntries(
        Object.entries(filters as FiltersData).filter(
          ([_, value]) => value !== null,
        ),
      ),
    ),
    tap(() => this.isLoading.set(true)),
    switchMap((filters) => {
      return this.api
        .request(
          'post',
          this.indexMeta.endpoints.index,
          filters,
          this.indexMeta.headers,
          this.indexMeta.params,
          this.indexMeta.indexApiVersion,
        )
        .pipe(
          map(({ data }) => data),
          tap((data) => {
            this.records.set(data.data);
            this.totalRecords.set(data.totalRecords);
            this.recordsFiltered.set(data.recordsFiltered);
            this.isLoading.set(false);
          }),
          catchError(() => {
            return of(null);
          }),
        );
    }),
  );

  loadRecordsReadOnly = toSignal(this.loadRecords$, { initialValue: null });

  // Common methods for CRUD operations
  protected loadRecords(event: LazyLoadEvent) {
    let globalFilter = event.globalFilter;
    if (globalFilter && globalFilter?.startsWith('0')) {
      globalFilter = globalFilter.slice(1);
    }

    this.globalFilterValue.set(globalFilter?.trim());

    const column = this.indexMeta.columns?.findIndex(
      (c) => c.name === event.sortField,
    );
    const sortOrder = column !== -1 ? (event.sortOrder ?? 1) * -1 : 1;

    this.filtersData.update((oldFilters) => {
      return {
        ...oldFilters,
        length: event.rows,
        start: event.first || 0,
        provideFields: this.indexMeta.provideFields,
        search: { value: this.globalFilterValue(), regex: false },
        columns: this.indexMeta.columns
          .filter(
            ({ render, ...col }) => col.name !== null && col.name !== undefined,
          )
          .map(({ render, ...col }) => col),
        order: [
          {
            column: column !== -1 ? column : 0,
            dir: sortOrder === 1 ? 'asc' : 'desc',
          },
        ],
      };
    });
  }

  protected dialogConfig = createDialogConfig({ width: '1180px' });

  protected openCreateRecordDialog(dialogConfig?: DynamicDialogConfig) {
    const dialogConfigOptions = dialogConfig ? dialogConfig : this.dialogConfig;
    this.dialogRef = this.dialogService.open(
      this.dialogComponent,
      dialogConfigOptions,
    );
    this.dialogRef?.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((record) => {
        if (!record) return;
        this.records.update((records) => [record, ...records]);
        this.totalRecords.update((totalRecords) => totalRecords + 1);
        this.recordsFiltered.update((recordsFiltered) => recordsFiltered + 1);
      });
  }

  protected openUpdateRecordDialog(model: any) {
    const dialogConfig = { ...this.dialogConfig, data: model };
    this.dialogRef = this.dialogService.open(
      this.dialogComponent,
      dialogConfig,
    );
    this.dialogRef?.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((record) => {
        this.updateRecord(record);
      });
  }

  updateRecord(record: T) {
    if (!record) return;
    this.records.update((records) =>
      records.map((item) =>
        item.id === record.id ? { ...item, ...record } : item,
      ),
    );
  }

  navigateCreatePage(route: string | undefined = undefined, model?: any) {
    const navigateRoute = route ? route : this.indexMeta.navigateCreatePage;
    this.router.navigate([`/${navigateRoute}`], {
      queryParams: { filtersQuery: JSON.stringify(model) },
    });
  }

  navigateUpdatePage(model: any) {
    this.router.navigate([`/${this.indexMeta.navigateUpdatePage}`], {
      queryParams: { filtersQuery: JSON.stringify(model) },
    });
  }

  confirmDelete(record: T) {
    this.confirmService.confirmDelete({
      acceptCallback: () => this.deleteRecord(record),
    });
  }

  initRolesUser() {
    const routeData = this.#route.snapshot.data;
    this.roles.set({
      index: this.userRoles.hasAnyRole(routeData.roles.index ?? []),
      create: this.userRoles.hasAnyRole(routeData.roles.store ?? []),
      show: this.userRoles.hasAnyRole(routeData.roles.show ?? []),
      update: this.userRoles.hasAnyRole(routeData.roles.update ?? []),
      delete: this.userRoles.hasAnyRole(routeData.roles.delete ?? []),
    });
  }

  protected deleteRecord(record: T) {
    this.api
      .request(
        'delete',
        this.indexMeta.endpoints.delete,
        { id: record.id },
        undefined,
        undefined,
        this.indexMeta.deleteApiVersion,
      )
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.handleDeleteRecord(record));
  }

  handleDeleteRecord(record: T) {
    this.records.update((records) => records.filter((i) => i.id !== record.id));
    this.totalRecords.update((totalRecords) => totalRecords - 1);
    this.recordsFiltered.update((recordsFiltered) => recordsFiltered - 1);
  }

  changeStatus(record: T, endpoint: string, key: string, value: any) {
    this.confirmService.confirmDelete({
      acceptCallback: () => {
        this.api
          .request('patch', endpoint, { id: record.id, [key]: value })
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe(() => {
            this.updateRecord({ ...record, [key]: value });
          });
      },
    });
  }

  openView(record: any) {
    this.showView.set(true);
    this.recordView.set(record);
  }

  protected getMultilingualField<
    T extends { content?: Array<{ language_id: number; [key: string]: any }> },
  >(record: T, fieldName: string): string {
    const content = record?.content || [];
    if (!content.length) return '';

    const currentContent = this.contentByLanguagePipe.transform(content);
    return currentContent?.[fieldName] || content[0]?.[fieldName] || '';
  }
}
