import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  model,
  output,
  signal,
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AutocompleteService } from '@gService/autocomplete.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { FormlyModule } from '@ngx-formly/core';
import {
  catchError,
  concat,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  Observable,
  of,
  Subject,
  switchMap,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-autocomplete-field',
  imports: [
    AsyncPipe,
    NgSelectModule,
    ReactiveFormsModule,
    FormsModule,
    FormlyModule,
  ],
  template: `
    @if (useFormly()) {
      <ng-select
        #searchRef
        [formControl]="formControl()"
        [formlyAttributes]="formlyAttributes()"
        [items]="items$ | async"
        [typeahead]="itemsInput$"
        [loading]="isLoading()"
        [placeholder]="placeholder()"
        [multiple]="multiple()"
        [trackByFn]="trackByFn"
        bindLabel="label"
        (search)="searchTerm.set($event.term)"
        (change)="onChange($event)"
        (clear)="onClear()"
        (focus)="searchRef.searchTerm = searchTerm() ?? ''"
      />
    } @else {
      <ng-select
        #searchRef
        [(ngModel)]="model"
        [items]="items$ | async"
        [typeahead]="itemsInput$"
        [placeholder]="placeholder()"
        [loading]="isLoading()"
        [multiple]="multiple()"
        [trackByFn]="trackByFn"
        bindLabel="label"
        (search)="searchTerm.set($event.term)"
        (change)="onChange($event)"
        (clear)="onClear()"
        (focus)="searchRef.searchTerm = searchTerm() ?? ''"
      />
    }
  `,
  styles: `
    :host ::ng-deep {
      ng-select.ng-invalid.ng-touched .ng-select-container {
        border-color: #dc3545;
        box-shadow: none;
      }
      &:not(.ng-select-disabled) > .ng-select-container{
        background-color: var(--azalove-form-field-background) !important;
      }
      .ng-select-single .ng-select-container {
        height: var(--field-height);
      }
      .ng-select-multiple .ng-select-container {
        min-height: var(--field-height);
        .ng-placeholder {
          top: 8px !important;
        }
      }
      .ng-select-container {
        z-index: auto !important;
        box-shadow: var(--azalove-form-field-shadow) !important;
        border-radius: var(--azalove-form-field-border-radius);
        color: var(--azalove-form-field-color);
        border-color: var(--azalove-form-field-border-color) !important;
        .ng-input {
          input {
            font-family: inherit;
          }
        }
        .ng-spinner-loader {
          border-top-color: var(--azalove-surface-200);
          border-right-color: var(--azalove-surface-200);
          border-bottom-color: var(--azalove-surface-200);
          border-left-color: var(--azalove-surface-500);
        }
        .ng-arrow-wrapper {
          display: none;
        }
        .ng-clear-wrapper {
          width: 20px;
        }
      }
      .ng-dropdown-panel {
        border-color: var(--azalove-surface-200);
      }
      .ng-dropdown-panel-items .ng-option {
        background-color: var(--azalove-surface-0);
        color: var(--azalove-surface-600);
      }
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AutocompleteFieldComponent {
  #autocomplete = inject(AutocompleteService);

  useFormly = input(false);
  formControl = input<FormControl<any>>(new FormControl());
  formlyAttributes = input<{ [key: string]: any }>({});
  entity = input('');
  transformFn = input<(items: any[]) => any[]>((items) => items);
  sideEffectFn = input<(data: any) => void>(() => (data: any) => {});
  placeholder = input('');
  multiple = input(false);
  model = model();
  change = output<any>();

  items$!: Observable<{ label: string; value: number }[]>;
  itemsInput$ = new Subject<string>();
  isLoading = signal(false);
  searchTerm = signal<string | null>(null);

  trackByFn(item: { value: number }) {
    return item.value;
  }

  ngOnInit() {
    this.loadItems();
  }

  loadItems() {
    this.items$ = concat(
      of([]),
      this.itemsInput$.pipe(
        filter((res) => !!res),
        filter((term) => !/^\s*$/.test(term)), // Prevent if term is only spaces
        distinctUntilChanged(),
        debounceTime(800),
        tap(() => this.isLoading.set(true)),
        switchMap((term) => {
          return this.#getItems(term).pipe(
            catchError(() => of([])), // empty list on error
            tap(() => this.isLoading.set(false)),
          );
        }),
      ),
    );
  }

  #getItems(term: string) {
    return this.#autocomplete.search(this.entity(), term).pipe(
      map(({ data }) => this.transformFn()(data)),
      tap((response) => {
        this.sideEffectFn()(response);
      }),
    );
  }

  onChange(value: any) {
    if (!value) return;
    const newValue = this.multiple()
      ? value.map((i: { value: number }) => i.value)
      : value.value;

    if (this.useFormly()) {
      this.formlyAttributes()
        .form?.get(this.formlyAttributes().props.fieldKey)
        ?.setValue(newValue);
    }
    this.change.emit(value);
  }

  onClear() {
    if (this.useFormly()) {
      this.formlyAttributes()
        .form?.get(this.formlyAttributes().props.fieldKey)
        ?.setValue(null);
    }
  }
}
