import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { NgSelectModule } from '@ng-select/ng-select';
import { TranslateModule } from '@ngx-translate/core';
import { AutocompleteService } from '@shared';
import { ButtonModule } from 'primeng/button';
import { Dialog } from 'primeng/dialog';
import { TooltipModule } from 'primeng/tooltip';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { ShowCustomerComponent } from './show-customer/show-customer.component';

interface SearchItem {
  id: number;
  label: string;
  type: 'user' | 'invoice' | 'subscription';
}

@Component({
  selector: 'app-global-search',
  imports: [
    ButtonModule,
    NgSelectModule,
    Dialog,
    TranslateModule,
    TooltipModule,
    FormsModule,
    ShowCustomerComponent,
  ],
  templateUrl: './global-search.component.html',
  styleUrl: './global-search.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalSearchComponent {
  #autocomplete = inject(AutocompleteService);
  searchTerm = signal<string | null>(null);
  isLoading = signal(false);

  showView = signal(false);
  type = signal<'user'>('user');
  selectedId = signal<number>(0);

  #loadItems(query: string | null = null) {
    return this.#autocomplete
      .search('global', query)
      .pipe(map(({ data }) => data));
  }

  items$ = toObservable(this.searchTerm).pipe(
    filter((term) => !!term),
    debounceTime(800),
    distinctUntilChanged(),
    tap(() => this.isLoading.set(true)),
    switchMap((term) =>
      this.#loadItems(term).pipe(
        catchError(() => of([])),
        tap(() => this.isLoading.set(false)),
      ),
    ),
  );

  items = toSignal(this.items$, { initialValue: [] });

  trackByFn(item: SearchItem) {
    return item.id;
  }

  openDialog(item: SearchItem) {
    this.showView.set(true);
    this.selectedId.set(item.id);
  }
}
