/**
 * PDF Form Handler - Form field operations
 */

import { PDFDocument, PDFTextField, PDFCheckBox, PDFRadioGroup, PDFDropdown, PDFName } from 'pdf-lib';
import { FormField, FormFieldType } from '../types/pdf';
import { getPDFManager } from './pdf-manager';

export class FormHandler {
  /**
   * List all form fields
   */
  async listFormFields(sessionId: string): Promise<FormField[]> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const form = document.getForm();
    const fields = form.getFields();

    const formFields: FormField[] = [];

    for (const field of fields) {
      const fieldName = field.getName();
      const fieldType = this.getFieldType(field);

      let value: string | boolean | string[] | undefined;
      let pageNumber: number | undefined;

      if (field instanceof PDFTextField) {
        value = field.getText();
      } else if (field instanceof PDFCheckBox) {
        value = field.isChecked();
      } else if (field instanceof PDFRadioGroup) {
        const selected = field.getSelected();
        value = selected ? selected : undefined;
      } else if (field instanceof PDFDropdown) {
        const selected = field.getSelected();
        value = selected ? selected : undefined;
      }

      // Try to get page number (approximate)
      try {
        const widgets = field.acroField.getWidgets();
        if (widgets.length > 0) {
          const widget = widgets[0];
          const pageRef = widget.dict.get(PDFName.of('P'));
          if (pageRef) {
            const pages = document.getPages();
            for (let i = 0; i < pages.length; i++) {
              if (pages[i].ref === pageRef) {
                pageNumber = i + 1;
                break;
              }
            }
          }
        }
      } catch (e) {
        // Page number not available
      }

      formFields.push({
        name: fieldName,
        type: fieldType,
        value,
        required: field.isRequired(),
        readOnly: field.isReadOnly(),
        pageNumber,
      });
    }

    return formFields;
  }

  /**
   * Fill a form field
   */
  async fillFormField(
    sessionId: string,
    fieldName: string,
    value: string | boolean | string[]
  ): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const form = document.getForm();
    const field = form.getField(fieldName as any);

    if (!field) {
      throw new Error(`Form field not found: ${fieldName}`);
    }

    if (field instanceof PDFTextField) {
      if (typeof value !== 'string') {
        throw new Error(`TextField requires string value, got ${typeof value}`);
      }
      field.setText(value);
    } else if (field instanceof PDFCheckBox) {
      if (typeof value !== 'boolean') {
        throw new Error(`CheckBox requires boolean value, got ${typeof value}`);
      }
      if (value) {
        field.check();
      } else {
        field.uncheck();
      }
    } else if (field instanceof PDFRadioGroup) {
      if (typeof value !== 'string') {
        throw new Error(`RadioGroup requires string value, got ${typeof value}`);
      }
      const options = field.getOptions();
      const optionToSelect = options.find(opt => opt === value);
      if (optionToSelect) {
        field.select(optionToSelect);
      }
    } else if (field instanceof PDFDropdown) {
      if (!Array.isArray(value)) {
        throw new Error(`Dropdown requires array value, got ${typeof value}`);
      }
      if (value.length > 0) {
        field.select(value[0]);
      }
    } else {
      throw new Error(`Unsupported field type for field: ${fieldName}`);
    }
  }

  /**
   * Fill multiple form fields at once
   */
  async fillFormFields(
    sessionId: string,
    fields: Record<string, string | boolean | string[]>
  ): Promise<{ filled: string[]; errors: Array<{ field: string; error: string }> }> {
    const filled: string[] = [];
    const errors: Array<{ field: string; error: string }> = [];

    for (const [fieldName, value] of Object.entries(fields)) {
      try {
        await this.fillFormField(sessionId, fieldName, value);
        filled.push(fieldName);
      } catch (error) {
        errors.push({
          field: fieldName,
          error: (error as Error).message,
        });
      }
    }

    return { filled, errors };
  }

  /**
   * Get all form values
   */
  async getFormValues(sessionId: string): Promise<Record<string, any>> {
    const fields = await this.listFormFields(sessionId);
    const values: Record<string, any> = {};

    for (const field of fields) {
      values[field.name] = field.value;
    }

    return values;
  }

  /**
   * Flatten form (make fields non-editable)
   */
  async flattenForm(sessionId: string): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const form = document.getForm();
    const fields = form.getFields();

    for (const field of fields) {
      const widgets = field.acroField.getWidgets();
      for (let i = widgets.length - 1; i >= 0; i--) {
        field.acroField.removeWidget(i);
      }
    }
  }

  /**
   * Create a text form field
   */
  async createTextField(
    sessionId: string,
    pageNumber: number,
    fieldName: string,
    x: number,
    y: number,
    width: number,
    height: number,
    defaultValue?: string
  ): Promise<void> {
    const session = getPDFManager().getSession(sessionId);
    const document = session.document;
    const form = document.getForm();
    const pages = document.getPages();
    
    if (pageNumber < 1 || pageNumber > pages.length) {
      throw new Error(`Invalid page number: ${pageNumber}`);
    }

    const page = pages[pageNumber - 1];
    const textField = form.createTextField(fieldName);
    
    if (defaultValue) {
      textField.setText(defaultValue);
    }
    
    textField.addToPage(page, {
      x,
      y,
      width,
      height,
    });
  }

  /**
   * Get field type from PDF field
   */
  private getFieldType(field: any): FormFieldType {
    if (field instanceof PDFTextField) {
      return 'text';
    } else if (field instanceof PDFCheckBox) {
      return 'checkbox';
    } else if (field instanceof PDFRadioGroup) {
      return 'radio';
    } else if (field instanceof PDFDropdown) {
      return 'dropdown';
    }
    return 'text'; // Default
  }
}

export const formHandler = new FormHandler();

