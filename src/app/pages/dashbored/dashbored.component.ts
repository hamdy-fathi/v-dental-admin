import { DatePipe, DecimalPipe, NgClass, NgStyle } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';
import { catchError, finalize, of, switchMap, tap } from 'rxjs';
import { DashboardService } from './dashboard.service';
import { CalendarModule } from 'primeng/calendar';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-dashbored',
  imports: [
    FormsModule,
    RouterModule,
    DecimalPipe,
    CardModule,
    NgStyle,
    ButtonModule,
    CalendarModule,
    ProgressSpinnerModule,
    SkeletonModule,
    TranslateModule,
  ],
  templateUrl: './dashbored.component.html',
  styleUrl: './dashbored.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class DashboredComponent {
  #dashboardService = inject(DashboardService);

  selectedDate = signal<Date>(new Date());
  isLoading = signal(false);
  isCalendarLoading = signal(false);
  error = signal<string | null>(null);

  selectedDate$ = toObservable(this.selectedDate);

  stats = toSignal(
    this.selectedDate$.pipe(
      tap(() => this.isLoading.set(true)),
      switchMap((date: Date) =>
        this.#dashboardService.getDashboardStats(date).pipe(
          tap(() => this.isLoading.set(true)),
          tap(() => this.error.set(null)),
          catchError((error) => {
            console.error('Error loading dashboard stats:', error);
            this.error.set(
              'Failed to load dashboard statistics. Please try again.',
            );
            return of({});
          }),
          finalize(() => this.isLoading.set(false)),
        ),
      ),
    ),
    { initialValue: [] },
  );

  calendarEvents = toSignal(
    this.#dashboardService.getCalendarEvents().pipe(
      tap(() => this.isCalendarLoading.set(true)),
      catchError((error) => {
        console.error('Error loading calendar events:', error);
        return of([]);
      }),
      finalize(() => this.isCalendarLoading.set(false)),
    ),
    { initialValue: [] },
  );

  // Helper methods for calendar events
  getEventColor(type: string): string {
    switch (type) {
      case 'appointment':
        return '#3b82f6'; // blue
      case 'meeting':
        return '#10b981'; // green
      case 'maintenance':
        return '#f97316'; // orange
      default:
        return '#6b7280'; // gray
    }
  }

  getEventBgColor(type: string): string {
    switch (type) {
      case 'appointment':
        return 'bg-blue-500';
      case 'meeting':
        return 'bg-green-500';
      case 'maintenance':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  }

  getEventIcon(type: string): string {
    switch (type) {
      case 'appointment':
        return 'pi pi-users';
      case 'meeting':
        return 'pi pi-users';
      case 'maintenance':
        return 'pi pi-wrench';
      default:
        return 'pi pi-calendar';
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'scheduled':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
