import { NgClass } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { FieldType, FieldTypeConfig, FormlyModule } from '@ngx-formly/core';
import { ButtonModule } from 'primeng/button';
import { ColorPickerModule } from 'primeng/colorpicker';
import { FloatLabel } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { TooltipModule } from 'primeng/tooltip';
import { map } from 'rxjs';
import { ApiService } from '../../services/global-services/api.service';
import { SvgWrapperComponent } from '../svg-wrapper.component';

interface FillAttribute {
  id: string;
  originalValue: string;
  currentValue: string;
  element: string;
}

interface ShapeCategory {
  id: number;
  type: string;
  shapeType: string;
  items: string[];
}

@Component({
  selector: 'formly-svg-validation-textarea-field',
  template: `
    <div [ngClass]="{ 'p-field': !props.isNotPField }">
      <p-floatlabel variant="on">
        <textarea
          pTextarea
          class="w-full"
          [formControl]="formControl"
          [formlyAttributes]="field"
          [rows]="props.rows || 8"
          (input)="onSvgInput($event)"
          placeholder="Enter SVG code here..."
        ></textarea>

        @if (props.label) {
          <label class="capitalize" [ngClass]="props.labelClass">
            {{ props.label }}
            @if (props.required && props.hideRequiredMarker !== true) {
              <span class="text-red">*</span>
            }
          </label>
        }
      </p-floatlabel>

      @if (props.description) {
        <p class="mt-1 mb-0 font-medium text-xs text-primary capitalize">
          {{ props.description }} <i class="fas fa-circle-info text-sm"></i>
        </p>
      }

      <!-- Validation Status -->
      @if (validationStatus()) {
        <div
          class="mt-3 p-3 border rounded-lg"
          [ngClass]="{
            'border-green-200 bg-green-50': validationStatus() === 'valid',
            'border-yellow-200 bg-yellow-50': validationStatus() === 'warning',
            'border-red-200 bg-red-50': validationStatus() === 'invalid'
          }"
        >
          <div class="flex items-center space-x-2">
            @if (validationStatus() === 'valid') {
              <i class="fas fa-check-circle text-green-600"></i>
              <span class="text-sm font-medium text-green-700"
                >SVG validation passed</span
              >
            } @else if (validationStatus() === 'warning') {
              <i class="fas fa-exclamation-triangle text-yellow-600"></i>
              <span class="text-sm font-medium text-yellow-700"
                >SVG validation warnings</span
              >
            } @else {
              <i class="fas fa-times-circle text-red-600"></i>
              <span class="text-sm font-medium text-red-700"
                >SVG validation failed</span
              >
            }
          </div>

          @if (validationDetails().length > 0) {
            <div class="mt-2 text-xs">
              @for (detail of validationDetails(); track detail) {
                <div
                  class="flex items-center space-x-1"
                  [ngClass]="{
                    'text-green-600': detail.type === 'valid',
                    'text-yellow-600': detail.type === 'warning',
                    'text-red-600': detail.type === 'invalid'
                  }"
                >
                  @if (detail.type === 'valid') {
                    <i class="fas fa-check text-xs"></i>
                  } @else if (detail.type === 'warning') {
                    <i class="fas fa-exclamation-triangle text-xs"></i>
                  } @else {
                    <i class="fas fa-times text-xs"></i>
                  }
                  <span>{{ detail.message }}</span>
                </div>
              }
            </div>
          }
        </div>
      }

      <!-- Fill Color Editor Section -->
      @if (fillAttributes().length > 0) {
        <div class="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
          <h4 class="text-sm font-medium text-blue-700 mb-3">
            <i class="fas fa-palette mr-2"></i>
            Fill Colors Found ({{ fillAttributes().length }}):
          </h4>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            @for (fillAttr of fillAttributes(); track fillAttr.id) {
              <div
                class="flex items-center space-x-2 p-2 bg-white rounded border"
              >
                <div class="flex-shrink-0">
                  <p-colorPicker
                    [(ngModel)]="fillAttr.currentValue"
                    (onChange)="onColorChange(fillAttr)"
                    [format]="'hex'"
                  ></p-colorPicker>
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-xs font-medium text-gray-700 truncate">
                    {{ fillAttr.element }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">
                    Original: {{ fillAttr.originalValue }}
                  </p>
                </div>
                <button
                  pButton
                  type="button"
                  icon="fas fa-undo"
                  class="p-button-text p-button-sm"
                  (click)="resetColor(fillAttr)"
                  pTooltip="Reset to original color"
                ></button>
              </div>
            }
          </div>
          <div class="mt-3 flex space-x-2">
            <button
              pButton
              type="button"
              label="Apply All Changes"
              icon="fas fa-check"
              class="p-button-success p-button-sm"
              (click)="applyAllColorChanges()"
            ></button>
            <button
              pButton
              type="button"
              label="Reset All"
              icon="fas fa-undo"
              class="p-button-secondary p-button-sm"
              (click)="resetAllColors()"
            ></button>
          </div>
        </div>
      }

      <!-- SVG Preview Section -->
      @if (svgContent() && !svgError()) {
        <div class="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h4 class="text-sm font-medium text-gray-700 mb-2">SVG Preview:</h4>
          <app-svg-wrapper
            class="svg-preview-container border border-gray-300 rounded p-4 bg-white min-h-[200px] flex items-center justify-center"
            viewBox="0 0 30 30"
            width="100%"
            height="200"
            [groupContent]="svgContent()"
          ></app-svg-wrapper>
        </div>
      }

      @if (svgError()) {
        <div class="mt-2 p-3 border border-red-200 rounded-lg bg-red-50">
          <p class="text-sm text-red-600">
            <i class="fas fa-exclamation-triangle mr-1"></i>
            Invalid SVG: {{ svgError() }}
          </p>
        </div>
      }

      @if (showError && formControl.errors) {
        <small class="error-msg" role="alert">
          <formly-validation-message [field]="field" />
        </small>
      }
    </div>
  `,
  styles: [
    `
      .svg-preview-container {
        overflow: auto;
        max-height: 400px;
      }

      .svg-preview-container svg {
        max-width: 100%;
        max-height: 100%;
      }
    `,
  ],
  imports: [
    NgClass,
    TextareaModule,
    FloatLabel,
    FormlyModule,
    ReactiveFormsModule,
    FormsModule,
    ColorPickerModule,
    ButtonModule,
    TooltipModule,
    SvgWrapperComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SvgValidationTextareaComponent
  extends FieldType<FieldTypeConfig>
  implements OnInit
{
  svgContent = signal<SafeHtml>('');
  svgError = signal<string>('');
  fillAttributes = signal<FillAttribute[]>([]);
  validationStatus = signal<'valid' | 'warning' | 'invalid' | null>(null);
  validationDetails = signal<
    Array<{ type: 'valid' | 'warning' | 'invalid'; message: string }>
  >([]);

  #destroyRef = inject(DestroyRef);
  #sanitizer = inject(DomSanitizer);
  #api = inject(ApiService);
  #shapeCategories = signal<ShapeCategory[]>([]);

  ngOnInit() {
    // Fetch shape categories on component initialization
    this.#api
      .request('get', 'shape-categories/grouped')
      .pipe(
        map(({ data }) => data),
        takeUntilDestroyed(this.#destroyRef),
      )
      .subscribe((data: ShapeCategory[]) => {
        this.#shapeCategories.set(data);

        // Debug: Log the shape categories for validation
        console.log(
          'Shape categories loaded:',
          data.map((cat) => ({
            type: cat.type,
            shapeType: cat.shapeType,
            itemsCount: cat.items?.length || 0,
            sampleItems: cat.items?.slice(0, 3) || [],
          })),
        );
        if (this.formControl.value) {
          this.validateSvgAgainstApi(this.formControl.value);
        }
      });
  }

  onSvgInput(event: any) {
    const svgCode = event.target.value;
    this.validateAndRenderSvg(svgCode);
    this.detectFillAttributes(svgCode);
    this.validateSvgAgainstApi(svgCode);
  }

  private validateSvgAgainstApi(svgCode: string) {
    if (!svgCode || !this.#shapeCategories().length) {
      return;
    }

    const details: Array<{
      type: 'valid' | 'warning' | 'invalid';
      message: string;
    }> = [];
    let hasInvalidElements = false;
    let hasWarnings = false;
    let cleanedSvg = svgCode;

    try {
      // Use browser's DOMParser or create a temporary div for parsing
      let doc: Document;
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        doc = parser.parseFromString(svgCode, 'image/svg+xml');
      } else {
        // Fallback for environments without DOMParser
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgCode;
        doc = tempDiv.ownerDocument || document;
      }

      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        details.push({ type: 'invalid', message: 'No SVG element found' });
        hasInvalidElements = true;
        return;
      }

      // Check for required layers
      const layer2 = svgElement.querySelector('g[id="Layer_2"]');
      const layer4 = svgElement.querySelector('g[id="Layer_4"]');

      if (!layer2) {
        details.push({ type: 'invalid', message: 'Missing required Layer_2' });
        hasInvalidElements = true;
      } else {
        details.push({ type: 'valid', message: 'Layer_2 found' });

        // Level 1: Check if Layer_2 exists in ShapeCategory data
        const layer2Category = this.#shapeCategories().find(
          (cat) => cat.type === 'Layer_2',
        );

        if (!layer2Category) {
          details.push({
            type: 'invalid',
            message:
              'Layer_2 not found in ShapeCategory data - removing all nested content',
          });
          hasInvalidElements = true;

          // Remove all nested groups inside Layer_2
          const nestedGroups = Array.from(layer2.querySelectorAll('g[id]'));
          nestedGroups.forEach((nestedGroup) => {
            const nestedGroupId = nestedGroup.getAttribute('id');
            details.push({
              type: 'invalid',
              message: `Removed nested group: ${nestedGroupId} (Layer_2 not in ShapeCategory)`,
            });
            nestedGroup.remove();
          });
        } else {
          details.push({
            type: 'valid',
            message: 'Layer_2 exists in ShapeCategory data',
          });
        }
      }

      if (!layer4) {
        details.push({ type: 'invalid', message: 'Missing required Layer_4' });
        hasInvalidElements = true;
      } else {
        details.push({ type: 'valid', message: 'Layer_4 found' });

        // Level 2: Check if Layer_4 exists in ShapeCategory data
        const layer4Category = this.#shapeCategories().find(
          (cat) => cat.type === 'Layer_4',
        );

        if (!layer4Category) {
          details.push({
            type: 'invalid',
            message:
              'Layer_4 not found in ShapeCategory data - removing all nested content',
          });
          hasInvalidElements = true;

          // Remove all nested groups inside Layer_4
          const nestedGroups = Array.from(layer4.querySelectorAll('g[id]'));
          nestedGroups.forEach((nestedGroup) => {
            const nestedGroupId = nestedGroup.getAttribute('id');
            details.push({
              type: 'invalid',
              message: `Removed nested group: ${nestedGroupId} (Layer_4 not in ShapeCategory)`,
            });
            nestedGroup.remove();
          });
        } else {
          details.push({
            type: 'valid',
            message: 'Layer_4 exists in ShapeCategory data',
          });
        }
      }

      // Validate Layer_2 contents if it exists
      if (layer2) {
        const validShapeTypes = this.#shapeCategories()
          .filter((cat) => cat.type === 'Layer_2')
          .map((cat) => cat.shapeType);

        // Only process groups that are actual shape types (not layer names like Layer_224)
        const shapeTypeGroups = Array.from(
          layer2.querySelectorAll('g[id]'),
        ).filter((group) => {
          const groupId = group.getAttribute('id');
          // Skip groups that start with "Layer_" as they are not shape types
          return (
            groupId &&
            !groupId.startsWith('Layer_') &&
            validShapeTypes.includes(groupId)
          );
        });

        shapeTypeGroups.forEach((group) => {
          const groupId = group.getAttribute('id');
          details.push({
            type: 'valid',
            message: `Valid shape type: ${groupId}`,
          });

          // Get the specific ShapeCategory for this group
          const groupCategory = this.#shapeCategories().find(
            (cat) => cat.shapeType === groupId,
          );

          if (groupCategory && groupCategory.items) {
            // Level 4: Validate items within this group
            const validItems = groupCategory.items;
            // Only check direct children with IDs, not all nested elements
            const groupElements = Array.from(group.children).filter(
              (child) => child.tagName === 'g' && child.hasAttribute('id'),
            );

            groupElements.forEach((element) => {
              const elementId = element.getAttribute('id');
              if (elementId && !validItems.includes(elementId)) {
                details.push({
                  type: 'invalid',
                  message: `Removed invalid item: ${elementId} (not in ${groupId} items)`,
                });
                hasInvalidElements = true;

                // Remove invalid item
                element.remove();
              } else if (elementId) {
                details.push({
                  type: 'valid',
                  message: `Valid item in ${groupId}: ${elementId}`,
                });
              }
            });
          }
        });

        // Check for invalid shape type groups (only direct children of Layer_2, not nested items)
        const directChildren = Array.from(layer2.children).filter(
          (child) => child.tagName === 'g' && child.hasAttribute('id'),
        );
        const invalidGroups = directChildren.filter((group) => {
          const groupId = group.getAttribute('id');
          return (
            groupId &&
            !groupId.startsWith('Layer_') &&
            !validShapeTypes.includes(groupId)
          );
        });

        // Remove invalid groups immediately during validation
        invalidGroups.forEach((group) => {
          const groupId = group.getAttribute('id');
          details.push({
            type: 'invalid',
            message: `Removed invalid group and all nested content: ${groupId}`,
          });
          hasInvalidElements = true;
          group.remove();
        });

        cleanedSvg = new XMLSerializer().serializeToString(svgElement);
      }

      // Set validation status
      if (hasInvalidElements) {
        this.validationStatus.set('invalid');
      } else if (hasWarnings) {
        this.validationStatus.set('warning');
      } else {
        this.validationStatus.set('valid');
      }

      this.validationDetails.set(details);

      if (cleanedSvg !== svgCode) {
        this.formControl.setValue(cleanedSvg);
        this.validateAndRenderSvg(cleanedSvg);
        this.detectFillAttributes(cleanedSvg);
      } else {
        console.log('No changes detected, field not updated');
      }
    } catch (error) {
      details.push({ type: 'invalid', message: `Validation error: ${error}` });
      this.validationStatus.set('invalid');
      this.validationDetails.set(details);
    }
  }

  private validateAndRenderSvg(svgCode: string) {
    if (!svgCode.trim()) {
      this.svgContent.set('');
      this.svgError.set('');
      return;
    }

    try {
      // Use browser's DOMParser or create a temporary div for parsing
      let doc: Document;
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        doc = parser.parseFromString(svgCode, 'image/svg+xml');
      } else {
        // Fallback for environments without DOMParser
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgCode;
        doc = tempDiv.ownerDocument || document;
      }

      const svgElement = doc.querySelector('svg');

      if (!svgElement) {
        this.svgError.set('No SVG element found');
        this.svgContent.set('');
        return;
      }

      // Check for parsing errors
      const parserError = doc.querySelector('parsererror');
      if (parserError) {
        this.svgError.set('Invalid SVG format');
        this.svgContent.set('');
        return;
      }

      // Sanitize and render
      const sanitizedSvg = this.#sanitizer.bypassSecurityTrustHtml(svgCode);
      this.svgContent.set(sanitizedSvg);
      this.svgError.set('');
    } catch (error) {
      this.svgError.set(`SVG parsing error: ${error}`);
      this.svgContent.set('');
    }
  }

  private detectFillAttributes(svgCode: string) {
    if (!svgCode) {
      this.fillAttributes.set([]);
      return;
    }

    try {
      // Use browser's DOMParser or create a temporary div for parsing
      let doc: Document;
      if (typeof DOMParser !== 'undefined') {
        const parser = new DOMParser();
        doc = parser.parseFromString(svgCode, 'image/svg+xml');
      } else {
        // Fallback for environments without DOMParser
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = svgCode;
        doc = tempDiv.ownerDocument || document;
      }

      const elementsWithFill = doc.querySelectorAll('[fill]');

      const fillAttrs: FillAttribute[] = [];
      elementsWithFill.forEach((element, index) => {
        const fillValue = element.getAttribute('fill');
        if (fillValue && fillValue !== 'none' && fillValue !== 'currentColor') {
          fillAttrs.push({
            id: `fill-${index}`,
            originalValue: fillValue,
            currentValue: fillValue,
            element:
              element.tagName.toLowerCase() +
              (element.id ? `#${element.id}` : ''),
          });
        }
      });

      this.fillAttributes.set(fillAttrs);
    } catch (error) {
      this.fillAttributes.set([]);
    }
  }

  onColorChange(fillAttr: FillAttribute) {
    // Update the SVG content with the new color
    const currentSvg = this.formControl.value;
    if (currentSvg && fillAttr.originalValue !== fillAttr.currentValue) {
      const updatedSvg = currentSvg.replace(
        new RegExp(`fill="${fillAttr.originalValue}"`, 'g'),
        `fill="${fillAttr.currentValue}"`,
      );
      this.formControl.setValue(updatedSvg);
      this.validateAndRenderSvg(updatedSvg);
    }
  }

  resetColor(fillAttr: FillAttribute) {
    fillAttr.currentValue = fillAttr.originalValue;
    this.onColorChange(fillAttr);
  }

  applyAllColorChanges() {
    this.fillAttributes().forEach((fillAttr) => {
      if (fillAttr.originalValue !== fillAttr.currentValue) {
        this.onColorChange(fillAttr);
      }
    });
  }

  resetAllColors() {
    this.fillAttributes().forEach((fillAttr) => {
      fillAttr.currentValue = fillAttr.originalValue;
    });
    this.applyAllColorChanges();
  }
}
