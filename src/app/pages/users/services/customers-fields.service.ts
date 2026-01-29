import { inject, Injectable, signal } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { TranslateService } from '@ngx-translate/core';
import { FieldBuilderService } from '@shared';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CustomersFieldsService {
  translate = inject(TranslateService);
  fieldBuilder = inject(FieldBuilderService);
  pageList$ = of(1);
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
          key: 'birthOfDate',
          type: 'date-field',
          className: 'md:col-4 col-12',
          props: {
            required: true,
            label: _('birth of date'),
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
