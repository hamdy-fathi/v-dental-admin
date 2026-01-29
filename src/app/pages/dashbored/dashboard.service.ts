import { inject, Injectable } from '@angular/core';
import { ApiService } from '@shared';
import { map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  #api = inject(ApiService);

  getDashboardStats(date: Date): Observable<any> {
    const formattedDate = this.formatDateForAPI(date);

    return this.#api
      .request('get', `dashboard/stats?date=${formattedDate}`)
      .pipe(map(({ data }) => data.data));
  }

  getCalendarEvents(): Observable<any[]> {
    return this.#api.request<null, any>('get', `dashboard/recent-orders`).pipe(
      map((response) => response.data),
      map((response) =>
        response.data.map((item: any) => ({
          id: item.id,
          payment: item.paymentStatus,
          status: item.status,
          total: item.total,
        })),
      ),
    );
  }

  private formatDateForAPI(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
