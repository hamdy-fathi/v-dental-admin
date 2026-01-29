import { TemplateRef } from '@angular/core';
import { environment } from '@env';
import { Observable, of } from 'rxjs';
import { RequestHeaders, RequestParams } from './api.service';

/* In TypeScript, interfaces only define the shape of an object but do not allow us to assign default values directly. This is because interfaces do not exist at runtime; they are a compile-time construct used for type checking. To assign default values, we can consider using a class to generate an instance with default values */

// Global types (models/entities)
export interface GlobalApiResponse {
  message: string;
  status: boolean;
  data: any;
}

export type EditData<T> = T & {
  [key: string]: any;
};

export interface BreadcrumbItem {
  label?: string;
  url?: string;
  icon?: string;
}

export interface DataTableColumn {
  title?: string | null;
  name?: string | null;
  searchable?: boolean | null;
  orderable?: boolean | null;
  search?: {
    value?: string | null;
    regex?: boolean | null;
  };
  format?: string;
  render?: TemplateRef<any> | null;
}

export interface FiltersData {
  [key: string]: any;
}

export interface Charts {
  date_range: string[];
  charts: string[];
}

export class BaseCrudIndexMeta {
  endpoints: { [key: string]: string };
  columns: DataTableColumn[];
  provideFields: string[];
  indexIcon: string;
  indexTitle: string;
  navigateCreatePage: string;
  navigateUpdatePage: string;
  displayCreateButton: boolean;
  displayUpdateButton: boolean;
  displayDeleteButton: boolean;
  displayViewButton: boolean;
  withAction: boolean;
  createBtnLabel: string;
  indexTableKey: string | undefined;
  reorderableColumns?: boolean;
  displayFilterButton: boolean;
  reorderableRows?: boolean;
  reorderEndpoint?: string | null;
  headers?: RequestHeaders;
  params?: RequestParams;
  indexApiVersion?: string;
  deleteApiVersion?: string;

  constructor() {
    this.endpoints = {} as { [key: string]: string };
    this.columns = [];
    this.provideFields = [];
    this.indexIcon = 'fa-solid fa-info';
    this.withAction = true;
    this.displayCreateButton = true;
    this.displayUpdateButton = true;
    this.displayDeleteButton = true;
    this.displayFilterButton = true;
    this.displayViewButton = false;
    this.indexTitle = 'Index';
    this.navigateCreatePage = '/';
    this.navigateUpdatePage = '/';
    this.createBtnLabel = 'Create New Item';
    this.indexTableKey = undefined;
    this.reorderableColumns = false;
    this.reorderableRows = false;
    this.reorderEndpoint = null;
    this.headers = undefined;
    this.params = undefined;
    this.indexApiVersion = environment.API_VERSION;
    this.deleteApiVersion = environment.API_VERSION;
  }
}

export class BaseCrudDialogMeta {
  endpoints: { [key: string]: string };
  showDialogHeader: boolean;
  dialogData$: Observable<any>;
  isTitleRenderedAsBtn: boolean;
  dialogTitle: string;
  dialogSubtitle: string;
  titleIcon: string;
  dialogTitleClass: string;
  submitButtonLabel: string;
  showResetButton: boolean;
  showFormActions: boolean;
  showSubmitButton: boolean;
  headers?: RequestHeaders;
  params?: RequestParams;
  createApiVersion?: string;
  updateApiVersion?: string;

  constructor() {
    this.endpoints = {} as { [key: string]: string };
    this.showDialogHeader = true;
    this.dialogData$ = of(1);
    this.isTitleRenderedAsBtn = false;
    this.dialogTitle = '';
    this.dialogSubtitle = '';
    this.titleIcon = '';
    this.dialogTitleClass = '';
    this.submitButtonLabel = '';
    this.showResetButton = false;
    this.showFormActions = true;
    this.showSubmitButton = true;
    this.headers = undefined;
    this.params = undefined;
    this.createApiVersion = environment.API_VERSION;
    this.updateApiVersion = environment.API_VERSION;
  }
}

export type PartialBaseCrudDialogMeta = Partial<BaseCrudDialogMeta>;
