import { DatePipe, DecimalPipe, NgTemplateOutlet } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  computed,
  contentChild,
  inject,
  input,
  model,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxTranslateCutModule } from 'ngx-translate-cut';
import { ButtonModule } from 'primeng/button';
import { Card } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { Skeleton } from 'primeng/skeleton';
import { Table, TableModule, TableService } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { TooltipModule } from 'primeng/tooltip';
import { RoleVisibilityDirective } from 'src/app/shared/directives';
import {
  FormatStringPipe,
  NestedPropertyPipe,
  RangePipe,
} from 'src/app/shared/pipes';
import { constants } from '../../config';
import { FallbackPipe } from '../../pipes/fallback.pipe';
import { DataTableColumn, LangService } from '../../services';

export function tableFactory(table: TableWrapperComponent): Table {
  return table.primengTable();
}

@Component({
  selector: 'app-table-wrapper',
  templateUrl: './table-wrapper.component.html',
  styleUrls: ['./table-wrapper.component.scss'],
  providers: [
    DecimalPipe,
    TableService,
    {
      provide: Table,
      useFactory: tableFactory,
      deps: [TableWrapperComponent],
    },
  ],
  imports: [
    NgTemplateOutlet,
    RangePipe,
    Skeleton,
    FormatStringPipe,
    InputTextModule,
    DatePipe,
    IconField,
    TagModule,
    InputIcon,
    Card,
    NestedPropertyPipe,
    DividerModule,
    ButtonModule,
    TooltipModule,
    TranslateModule,
    NgxTranslateCutModule,
    TableModule,
    RoleVisibilityDirective,
    FallbackPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableWrapperComponent {
  #translate = inject(TranslateService);
  #decimalPipe = inject(DecimalPipe);
  currentLang = inject(LangService).currentLanguage;

  additionalContentTemplate = contentChild<TemplateRef<any>>(
    'additionalContentTemplate',
  );
  customFiltersTemplate = contentChild<TemplateRef<any>>(
    'customFiltersTemplate',
  );
  headerTemplate = contentChild<TemplateRef<any>>('headerTemplate');
  actionsTemplate = contentChild<TemplateRef<any>>('actionsTemplate');
  extendDefaultActionsTemplate = contentChild<TemplateRef<any>>(
    'extendDefaultActionsTemplate',
  );
  bodyTemplate = contentChild<TemplateRef<any>>('bodyTemplate');
  loadingBodyTemplate = contentChild<TemplateRef<any>>('loadingBodyTemplate');
  expandedRowTemplate = contentChild<TemplateRef<any>>('expandedRowTemplate');
  primengTable = viewChild.required<Table>('primengTable');

  constants = constants;
  displayFilters = model(false);
  showScrollHint = model(true);
  isListLayout = model(true);
  withMultiLayout = input(false);
  withScreenHeader = input(true);
  withCustomFilters = input(false);
  displayFilterBtn = input(false);
  withActionsColumn = input(true);
  displayViewButton = input(false);
  displayCreateButton = input(true);
  displayUpdateButton = input(true);
  displayDeleteButton = input(true);
  indexRole = input<boolean>(true);
  createBtnRole = input<boolean>(true);
  showViewBtnRole = input<boolean>(true);
  updateBtnRole = input<boolean>(true);
  deleteBtnRole = input<boolean>(true);
  withResetButton = input(true);
  headerTitle = input<string>();
  headerSubTitle = input<string>();
  titleIcon = input<string>();
  titleClass = input<string>();
  headerBtnLabel = input<string>('');
  withAdditionalContent = input(false);
  dataSource = input<any[]>([]);
  columns = input<DataTableColumn[]>([]);
  reorderableColumns = input(false);
  reorderableRows = input(false);
  responsiveLayout = input('scroll'); // "scroll" | "stack"
  breakpoint = input('767px');
  dataKey = input('id');
  stateKey = input<string | undefined>();
  rowExpandMode = input<'single' | 'multiple'>('single');
  totalRecords = input(0);
  recordsFiltered = input<number>();
  editMode = input<'cell' | 'row'>('cell'); // "cell" | "row"
  rowHover = input(false);
  lazy = input(true);
  lazyLoadOnInit = input(true);
  first = signal<number>(0);
  rows = model(constants.TABLE_ROWS_LENGTH);
  loading = input(false);
  showCurrentPageReport = input(true);
  rowsPerPageOptions = input<number[] | undefined>([5, 10, 20, 30, 50]);
  paginator = input(true);
  globalFilterFields = input<string[]>([]);
  globalFilterValue = input<string | null>();
  withSelection = input(false);
  selectionMode = input<'single' | 'multiple' | null>(null); // "single" | "multiple"
  selectionPageOnly = input(true);
  selection = model<any>();
  withTableSearch = input(true);
  showGridlines = input(true);
  stripedRows = input(false);
  styleClass = input<string>();

  onLoadData = output<any>();
  selectionChange = output<any>();
  selectAllChange = output<any>();
  editComplete = output<any>();
  columnSortChange = output();
  onRowReorder = output<any>();
  createBtnClicked = output();
  updateBtnClicked = output();
  viewClicked = output();
  deleteBtnClicked = output<any>();
  onStateSave = output<any>();
  onStateRestore = output<any>();

  removeScrollHint() {
    if (!this.showScrollHint()) return;
    this.showScrollHint.set(false);
  }

  #formatNumber(num: number | undefined): string {
    return this.#decimalPipe.transform(num, '1.0-0') || '';
  }

  currentPageReport = computed(() => {
    const filteredFrom = this.globalFilterValue()
      ? ` (${this.#translate.instant(
          _('report_table.filtered_from'),
        )} ${this.#formatNumber(this.totalRecords())} ${this.#translate.instant(
          _('total_entries'),
        )})`
      : '';

    const showing = this.#translate.instant(_('report_table.showing'));
    const toRecords = this.#translate.instant(_('report_table.to'));
    const ofRecords = this.#translate.instant(_('report_table.of'));

    const lastValue = Math.min(this.first() + this.rows(), this.totalRecords());
    const first = this.recordsFiltered() === 0 ? 0 : this.first() + 1;
    const last = this.recordsFiltered() === 0 ? 0 : lastValue;

    return !this.loading()
      ? `${showing} ${first} ${toRecords} ${last} ${ofRecords} ${this.#formatNumber(
          this.recordsFiltered(),
        )} ${this.#translate.instant(_('entries'))} ${filteredFrom}`
      : '';
  });

  getTableClass() {
    return `
      p-datatable-sm
      ${this.styleClass()}
      ${this.isListLayout() && this.withMultiLayout() ? 'list-layout' : ''}
      ${!this.isListLayout() && this.withMultiLayout() ? 'grid-layout' : ''}
    `;
  }

  placeHolderSearch = computed(() => {
    return `Search By ${this.columns()
      .filter((col) => col.searchable)
      .map((item) => item.title)
      .join(', ')}`;
  });

  getStatusSeverity(status: string) {
    const statusMap: { [key: string]: string } = {
      cancelled: 'danger',
      no_show: 'danger',
      scheduled: 'warn',
    };

    return statusMap[status];
  }

  resetTable() {
    this.primengTable().reset();
    this.primengTable().clearState();
    this.selectionChange.emit([]);
  }
}
