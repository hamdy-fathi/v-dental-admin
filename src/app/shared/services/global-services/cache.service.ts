import { inject, Injectable } from "@angular/core";
import { environment } from "@env";
import { map, Observable, shareReplay } from "rxjs";
import { ApiService, RequestHeaders, RequestParams } from "./api.service";

@Injectable({
  providedIn: 'root',
})
export class CacheService {
  #api = inject(ApiService);
  cachedData$: { [key: string]: Observable<any> } = {};

  getData(
    endpoint: string,
    requestType: 'get' | 'post' = 'post',
    bodyPayload = {},
    cacheKey?: string,
    headers?: RequestHeaders,
    params?: RequestParams,
    apiVersion = environment.API_VERSION,
  ) {
    const key = cacheKey || endpoint;
    
    if (this.cachedData$[key]) {
      return this.cachedData$[key];
    }

    let request$: Observable<any>;

    if (requestType === 'get') {
      // GET Request
      request$ = this.#api
        .request('get', endpoint, undefined, headers, params, apiVersion)
        .pipe(map(({ data }) => data));
    } else {
      // POST Request
      request$ = this.#api
        .request('post', endpoint, bodyPayload, headers, params, apiVersion)
        .pipe(map(({ data }) => data));
    }

    this.cachedData$[key] = request$.pipe(shareReplay(1));

    return this.cachedData$[key];
  }
}
