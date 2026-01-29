import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
} from '@angular/core';
import { FormComponent } from '@shared';
import { FormPageComponent } from 'src/app/shared/components/form-page/form-page.component';
import { SpinnerComponent } from '../../../shared/components/spinner.component';
import { BlogFieldsService } from '../services/blog-fields.service';
import { BlogModel } from '../services/services-type';

@Component({
  selector: 'app-create-update-blog',
  standalone: true,
  imports: [AsyncPipe, FormComponent, SpinnerComponent],
  templateUrl: '../../../shared/components/form-page/form-page.component.html',
  providers: [BlogFieldsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class CreateUpdateBlogComponent extends FormPageComponent {
  fieldsService = inject(BlogFieldsService);

  ngOnInit() {
    this.pageList$ = this.fieldsService.pageList$;
    this.isDisabled = computed(
      () =>
        this.fieldsService.isSingleUploading() ||
        this.fieldsService.isMultiUploading(),
    );
    this.filtersQuery() ? this.setupForm(true) : this.setupForm(false);
    this.fields.set(this.fieldsService.configureFields(this.filtersQuery()));
    this.navigateAfterSubmit.set('blogs');
  }

  setupForm(isUpdate: boolean) {
    this.model = isUpdate
      ? new BlogModel(this.filterDataForUpdate(new BlogModel()))
      : new BlogModel();

    this.formTitle.set(isUpdate ? 'Update Blog' : 'Create New Blog');
    this.submitLabel.set(isUpdate ? 'Update' : 'Create');
    this.endpoint.set(isUpdate ? 'blog/update' : 'blog/store');
  }
}
