import { inject, Injectable, signal } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { GlobalListService } from '@gService/global-list.service';
import { TranslateService } from '@ngx-translate/core';
import { FieldBuilderService } from '@shared';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserFieldsService {
  translate = inject(TranslateService);
  #globalList = inject(GlobalListService);
  fieldBuilder = inject(FieldBuilderService);
  pageList$ = this.#globalList.getGlobalList('user');
  isSingleUploading = signal(false);

  configureFields(editData: any) {
    return [
      this.fieldBuilder.fieldBuilder([
        {
          key: 'firstName',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            required: true,
            label: _('First Name'),
          },
        },
        {
          key: 'lastName',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            required: true,
            label: _('Last Name'),
          },
        },
        {
          key: 'fullName',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            required: true,
            label: _('Full Name'),
          },
        },
        {
          key: 'email',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            required: true,
            label: _('Email Address'),
          },
          validators: {
            validation: ['email'],
          },
        },
        {
          key: 'phoneNumber',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            type: 'number',
            label: _('Phoe Number'),
          },
        },
        {
          key: 'role',
          type: 'select-field',
          props: {
            required: true,
            label: _('Role'),
            options: this.pageList$.pipe(map(({ roles }) => roles)),
          },
        },
        {
          key: 'username',
          type: 'input-field',
          className: 'md:col-4 col-12',
          props: {
            label: _('username'),
          },
        },
        {
          key: 'birthOfDate',
          type: 'date-field',
          className: 'md:col-4 col-12',
          props: {
            required: true,
            label: _('birth of date'),
          },
        },
      ]),
      {
        fieldGroup: [
          this.fieldBuilder.fieldBuilder([
            {
              validators: {
                validation: [
                  {
                    name: 'fieldMatch',
                    options: { errorPath: 'password_confirmation' },
                  },
                ],
              },
              fieldGroup: [
                this.fieldBuilder.fieldBuilder([
                  {
                    key: 'password',
                    type: 'password-field',
                    className: 'md:col-4 col-12',
                    props: {
                      label: _('password'),
                      placeholder: _('password'),
                      toggleMask: true,
                    },
                  },
                  {
                    key: 'password_confirmation',
                    type: 'password-field',
                    className: 'md:col-4 col-12',
                    props: {
                      label: _('password confirmation'),
                      placeholder: _('password confirmation'),
                      toggleMask: true,
                    },
                  },
                ]),
              ],
            },
          ]),
        ],
      },
      this.fieldBuilder.fieldBuilder([
        {
          key: 'avatar',
          type: 'file-field',
          props: {
            label: _('Avatar'),
            mode: editData ? 'update' : 'store',
            isUploading: this.isSingleUploading,
          },
        },
      ]),
    ];
  }
}
